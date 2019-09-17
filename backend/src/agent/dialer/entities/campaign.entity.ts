import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Hopper } from './hopper.entity';

@Entity({ name: 'vicidial_campaigns' })
export class Campaign {
  @PrimaryGeneratedColumn()
  campaign_id: number;

  @Column()
  campaign_name: string;

  @Column()
  active: string;

  @Column()
  no_hopper_leads_logins: 'Y' | 'N';

  @OneToMany(() => Hopper, hopper => hopper.campaign_id)
  hoppers: Hopper[];
}
