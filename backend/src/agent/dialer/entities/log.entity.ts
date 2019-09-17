import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lead } from './lead.entity';
import { CoalesceTransformer } from '../../../common/entity-transformers';

@Entity({ name: 'vicidial_log' })
export class Log {
  @PrimaryGeneratedColumn()
  uniqueid: string;

  @Column()
  lead_id: string;

  @Column({
    transformer: new CoalesceTransformer<string, string>('', ''),
  })
  phone_code: string;

  @Column()
  phone_number: string;

  @Column()
  comments: string;

  @Column({ name: 'call_date', type: 'datetime' })
  datetime: string;

  @Column({ name: 'user' })
  agentId: string;

  @Column({ name: 'length_in_sec' })
  duration: number;

  @Column('timestamp')
  end_epoch: number;

  @OneToOne(() => Lead, log => log.lead_id)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;
}
