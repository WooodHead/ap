import { Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Campaign } from './campaign.entity';

@Entity({ name: 'vicidial_hopper' })
export class Hopper {
  @PrimaryGeneratedColumn()
  hopper_id: number;

  @ManyToOne(() => Campaign, campaign => campaign.campaign_id)
  @JoinColumn({ name: 'campaign_id' })
  campaign_id: Campaign;
}
