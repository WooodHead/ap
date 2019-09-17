import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'vicidial_statuses' })
export class Status {
  @PrimaryColumn({ name: 'status' })
  value: string;

  @Column({ name: 'status_name' })
  title: string;

  @Column()
  selectable: string;
}
