import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'sip' })
export class Extension {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  keyword: string;

  @Column()
  data: string;
}
