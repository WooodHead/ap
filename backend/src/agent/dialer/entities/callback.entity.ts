import { Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Lead } from './lead.entity';
import { Campaign } from './campaign.entity';

@Entity({ name: 'vicidial_callbacks' })
export class Callback {
  @PrimaryGeneratedColumn()
  callback_id: number;

  @Column()
  callback_time: string;

  @Column()
  comments: string;

  @Column()
  status: string;

  @Column()
  campaign_id: number;

  @Column()
  user: string;

  @Column()
  lead_id: string;

  @OneToOne(() => Campaign, callback => callback.campaign_id)
  @JoinColumn({ name: 'campaign_id' })
  campaign: string;

  @OneToOne(() => Lead, callback => callback.lead_id)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;
}
