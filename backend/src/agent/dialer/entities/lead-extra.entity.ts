import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'vicidial_list_extra' })
export class LeadExtra {
  @PrimaryGeneratedColumn()
  lead_id: string;

  @Column({ name: 'salestatus' })
  crmStatus: string;

  @Column({ name: 'campaign' })
  crmCampaign: string;

  // FIXME add to list
  // @Column()
  // affiliate: string;
  //
  // @Column()
  // source1: string;
  //
  // @Column()
  // source2: string;
  //
  // @Column()
  // source3: string;
  //
  // @Column()
  // source4: string;
}
