import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'prisa' })
export class CallsHistory {
  @PrimaryGeneratedColumn()
  call_id: string;

  @Column({ name: 'calldatetime', type: 'datetime' })
  datetime: string;

  @Column({ name: 'agent_num' })
  agentId: string;

  @Column({ name: 'conv_duration' })
  duration: number;

  @Column({ name: 'caller_phone' })
  callerNumber: number;

  @Column({ name: 'src' })
  callerName: number;

  @Column({ name: 'in_out' })
  type: number;
}
