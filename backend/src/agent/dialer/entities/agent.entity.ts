import { Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from './user.entity';
import { Lead } from './lead.entity';
import { LeadExtra } from './lead-extra.entity';
import { Campaign } from './campaign.entity';

@Entity({ name: 'vicidial_live_agents' })
export class Agent {
  @PrimaryGeneratedColumn()
  live_agent_id: number;

  @Column({ name: 'status' })
  Status: string;

  @Column()
  conf_exten: string;

  @Column()
  callerid: string;

  @Column()
  channel: string;

  @Column()
  uniqueid: string;

  @Column()
  random_id: number;

  @Column('datetime')
  last_call_finish: Date;

  @Column('timestamp')
  last_state_change: number;

  @Column()
  calls_today: number;

  @Column()
  pause_code: string;

  @Column()
  extension: string;

  @OneToOne(() => Lead, agent => agent.lead_id)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @OneToOne(() => LeadExtra, agent => agent.lead_id)
  @JoinColumn({ name: 'lead_id' })
  leadExtra: LeadExtra;

  @OneToOne(() => Campaign, agent => agent.campaign_id)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @OneToOne(() => User, agent => agent.user)
  @JoinColumn({ name: 'user' })
  @Column()
  user: User;
}
