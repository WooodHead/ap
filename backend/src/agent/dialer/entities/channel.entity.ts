import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'live_sip_channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  channel: string;

  @Column()
  extension: string;
}
