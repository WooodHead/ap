import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { callsHistoryTableColumns } from './calls-history-table.columns';
import { PanelModeType } from '@app/panel/store/panel.state';

@Component({
  selector: 'app-calls-history-table',
  styleUrls: ['calls-history-table.component.scss'],
  templateUrl: 'calls-history-table.component.html',
})
export class CallsHistoryTableComponent {
  @Output() call = new EventEmitter();
  @Output() addContact = new EventEmitter();
  @Output() editContact = new EventEmitter();

  @Input() set tableData(data) {
    if (!data) return;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  @Input() panelMode: PanelModeType;

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = callsHistoryTableColumns;
  dataSource: MatTableDataSource<{}>;

  dial(data) {
    this.call.emit(data);
  }

  onContacts(data) {
    const contact = {
      number: data.callerNumber,
    };
    this.addContact.emit(contact);
  }

  edit(contact) {
    this.editContact.emit(contact);
  }
}
