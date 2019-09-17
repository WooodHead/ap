import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { skip } from 'rxjs/internal/operators/skip';
import { Subscription } from 'rxjs/internal/Subscription';

import { VSModalComponent } from '@app/shared/modals/vs-modal/vs-modal.component';
import { fadeAnimation } from '@app/shared/animations/fade.animation';
import { SnackBarService } from '@app/shared/components/vs-snackbar/snackbar.service';
import { DialerLogin } from '@dialer/store/dialer.actions';
import { DialerGetCampaigns, SetActiveCampaign } from '@dialer/store/dialer-campaigns.actions';
import { DialerCampaignState } from '@dialer/store/dialer-campaigns.state';
import { DialerCampaign } from '@dialer/models/campaign.model';


enum SwitchMode {
  campaign = 'campaign',
  userGroup = 'userGroup'
};
@Component({
  selector: 'app-dialer-campaign-modal',
  templateUrl: './dialer-campaign-modal.component.html',
  styleUrls: ['./dialer-campaign-modal.component.scss'],
  animations: [fadeAnimation],
})
export class DialerCampaignModalComponent extends VSModalComponent  implements OnInit, OnDestroy {
  @Select(DialerCampaignState.getLoading) loading$;
  @Select(DialerCampaignState.getList) campaigns$;
  @Select(DialerCampaignState.getUserGroup) userGroup$;

  private campaignSubscription: Subscription;
  public switchMode;
  public campaignsInfo = '';
  public submitCampaign;

  constructor(
    dialogRef: MatDialogRef<VSModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store,
    private snackBarService: SnackBarService,
    actions$: Actions,
  ) {
    super(dialogRef, data);

    actions$
      .pipe(ofActionSuccessful(SetActiveCampaign))
      .subscribe(() => this.close(true));
  }

  ngOnInit() {
    this.campaignSubscription = this.campaigns$
      .pipe(skip(1))
      .subscribe((campaigns: [DialerCampaign]) => {
        if (!campaigns || !campaigns.length) {
          this.snackBarService.open({
            message: 'panel.dialer.modals.no-active-campaign',
          });
          this.close(false);
        } else {
          if(campaigns[0].percentage) {
            this.submitCampaign = campaigns.find(
              ({ empty, noLeadsLoginAllowed }) => noLeadsLoginAllowed || !empty
              );
            this.switchMode = SwitchMode.userGroup;
            this.campaignsInfo = campaigns
              .map(campaign => `
                <b>${campaign.name ? campaign.name : campaign.id}</b>:&nbsp;${campaign.percentage}%
              `)
              .join(', ');
          } else {
            this.switchMode = SwitchMode.campaign;
          }
        }
      });
    this.store.dispatch(new DialerGetCampaigns());

    this.userGroup$.subscribe(val => console.log(val));
  }

  ngOnDestroy() {
    this.campaignSubscription.unsubscribe();
  }

  async selectCampaign(campaign: DialerCampaign = this.submitCampaign) {
    if(this.switchMode === SwitchMode.campaign 
      && campaign 
      && campaign.empty
      && !campaign.noLeadsLoginAllowed)
    {
      return;
    }

    this.store.dispatch(new DialerLogin(campaign));
  }
}
