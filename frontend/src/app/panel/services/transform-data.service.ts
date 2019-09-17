import { Injectable } from '@angular/core';
import { StatusService } from '@app/core/services/status/status.service';
import { Store } from '@ngxs/store';
import { filter } from 'rxjs/internal/operators';
import { PanelState } from '@app/panel/store/panel.state';
import { ClassField } from '@angular/compiler';

@Injectable()
export class TransformDataService {
  private sumKeys: string[];
  private unixtimeToSecondsKeys: string[];
  private datetimeToSecondsKeys: string[];
  private unixtimeDateKeys: string[];
  private avgColumns: any[];
  private liveColumns: any[];

  constructor(
    private statusService: StatusService,
    private store: Store,
  ) {
    this.store
      .select(PanelState.getColumns)
      .pipe(filter(columns => !!columns))
      .subscribe((columns) => {
        this.sumKeys = columns
          .filter(({ type }) => type === 'sum')
          .map(({ key }) => key);

        this.unixtimeToSecondsKeys = columns
          .filter(({ type, display }) => type === 'unixtime' && display === 'duration')
          .map(({ key }) => key);

        this.datetimeToSecondsKeys = columns
          .filter(({ type, display }) => type === 'datetime' && display === 'duration')
          .map(({ key }) => key);

        this.unixtimeDateKeys = columns
          .filter(({ type, display }) => type === 'unixtime' && display === 'date')
          .map(({ key }) => key);

        this.avgColumns = columns.filter(({ type }) => type === 'avg');

        this.liveColumns = columns.filter(({ live }) => live);
      });
  }

  updateLiveColumns(data, queues) {
    const status = data.Status.toLowerCase();

    this.liveColumns.forEach(({ live, key }) => {
      const shouldUpdate = !live.length || live.includes(status);

      if (shouldUpdate) {
        if (data.FromQueue) {
          queues[data.FromQueue][key] += 1;
        }

        data[key] += 1;
      }
    });

    if (this.statusService.check('shouldCalcAvg', status)) {
      this.updateAvgColumns(data, true);
    }
  }

  private sumByKeys(data, keys) {
    return keys.reduce((a, b) => (a || 0) + (data[b] || 0), 0);
  }

  updateAvgColumns(data, isLive = false) {
    this.avgColumns.forEach(({ calc, key }) => {
      const sum = this.sumByKeys(data, calc.sum);
      let divide = this.sumByKeys(data, calc.divide);

      // add +1 to divider part (calls qty) because it's coming from backend only after call ended
      if (isLive) {
        divide += 1;
      }

      data[key] = sum && divide ? Math.round(sum / divide) : 0;
    });
  }

  normalizeQueues(data) {
    return data.reduce(
      (a, b) => {
        a[b.Queue] = b;
        return a;
      },
      {},
    );
  }

  sumTableData(queues) {
    const [qHead, ...qTail] = queues;

    const groupped = qTail.reduce(
      (head, next) => {
        this.sumKeys.forEach((key) => {
          head[key] = (head[key] || 0) + (next[key] || 0);
        });

        this.unixtimeDateKeys.forEach((key) => {
          // compare unixtime valus (e.g. for "last call" column)
          if (head[key] < next[key]) {
            head[key] = next[key];
          }
        });

        return head;
      },
      Object.assign({}, qHead),
    );

    const dateNow = Date.now();
    this.unixtimeToSecondsKeys.forEach(key => this.calcTSDiff(groupped, key, dateNow));
    this.datetimeToSecondsKeys.forEach(key => this.calcDatetimeDiff(groupped, key, dateNow));

    this.unixtimeDateKeys.forEach((key) => {
      if (groupped[key] && groupped[key] !== 0) {
        groupped[key] += '000';
      } else {
        groupped[key] = '';
      }
    });

    const isIdle = this.statusService.check('isIdle', groupped.Status);

    if (isIdle) {
      groupped.TotalIdleDuration += groupped.StatusTime;
    }

    this.updateAvgColumns(groupped);

    return groupped;
  }

  private calcTSDiff(groupped, key, dateNow) {
    if (groupped[key] === 0) {
      return;
    }

    const seconds = (dateNow / 1000) - groupped[key];

    groupped[key] = seconds > 0 ? seconds : 0;
  }

  private calcDatetimeDiff(groupped, key, dateNow) {
    const seconds = (dateNow - new Date(groupped[key]).getTime()) / 1000;

    groupped[key] = seconds > 0 ? seconds : 0;
  }
}
