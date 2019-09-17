import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'vicidial_user_groups' })
export class UserGroup {
  @PrimaryGeneratedColumn()
  user_group: string;

  @Column()
  allowed_campaigns: string;
}
