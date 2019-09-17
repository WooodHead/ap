import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pause_codes' })
export class PauseCode {
  @PrimaryGeneratedColumn()
  pcode_id: number;

  @Column()
  pcode: string;

  @Column()
  pcode_desc: string;
}
