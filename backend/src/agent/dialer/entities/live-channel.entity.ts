import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'live_channels' })
export class LiveChannel {
  @PrimaryGeneratedColumn()
  channel: string;

  @Column()
  extension: string;
}
