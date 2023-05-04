import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'user_menus' })
export class UserMenuEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  menuId!: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'FK$USER_MENUS$USER_ID',
  })
  user!: UserEntity;

  @Column()
  accessId!: number;

  @Column()
  seeList!: boolean;

  @Column()
  createEntity!: boolean;

  @Column()
  updateEntity!: boolean;

  @Column()
  deleteEntity!: boolean;

  @Column()
  generateReports!: boolean;
}
