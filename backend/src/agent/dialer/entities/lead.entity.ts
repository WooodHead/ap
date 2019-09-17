import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CoalesceTransformer } from '../../../common/entity-transformers';

@Entity({ name: 'vicidial_list' })
export class Lead {
  @PrimaryGeneratedColumn()
  lead_id: string;

  @Column()
  list_id: string;

  @Column({
    transformer: new CoalesceTransformer<string, string>('', ''),
  })
  phone_code: string;

  @Column()
  phone_number: string;

  @Column()
  vendor_lead_code: string;

  @Column({
    transformer: new CoalesceTransformer<string, string>('', ''),
  })
  first_name: string;

  @Column({
    transformer: new CoalesceTransformer<string, string>('', ''),
  })
  last_name: string;

  @Column()
  email: string;

  @Column()
  country_code: string;

  @Column()
  city: string;

  @Column()
  address1: string;

  @Column()
  address2: string;

  @Column()
  comments: string;

  @Column()
  rank: number;

  @Column({ name: 'gmt_offset_now' })
  offset: string;

  @Column({ name: 'source_id' })
  source: string;

  @Column()
  title: string;

  get phoneNumber() {
    return this.phone_code + this.phone_number;
  }
}
