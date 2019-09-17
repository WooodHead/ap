import { Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserGroup } from './user-group.entity';

@Entity({ name: 'vicidial_users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  user: string;

  @OneToOne(() => UserGroup, user => user.user_group)
  @JoinColumn({ name: 'user_group' })
  @Column()
  user_group: UserGroup;
}
