import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parked_channels' })
export class ParkedChannel {
  @PrimaryGeneratedColumn()
  channel: string;

  @Column()
  parked_by: string;
}
