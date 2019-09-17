import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ParseBoolTransformer } from '../../common/entity-transformers';

@Entity({ name: 'agents' })
export class Agents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'number', type: 'varchar' })
  number: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'secret', type: 'varchar' })
  secret: string;

  @Column({ name: 'crmid', type: 'varchar' })
  crmid: string;

  @Column({ name: 'campaignid', type: 'varchar' })
  campaignid: string;

  @Column({ name: 'dialer', type: 'tinyint', transformer: new ParseBoolTransformer() })
  dialer: number;

  @Column({ name: 'state', type: 'int' })
  active: number;
}
