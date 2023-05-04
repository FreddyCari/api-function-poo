import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoleEntity } from '../roles/role.entity';
import { UserTypes } from '../../config/environment';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ unique: true })
  userName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ default: true })
  active!: boolean;

  @ManyToOne(() => RoleEntity, { nullable: false })
  @JoinColumn({ name: 'roleId', foreignKeyConstraintName: 'FK$USERS$ROLE_ID' })
  roleId!: RoleEntity;

  @Column({ type: 'enum', enum: UserTypes, nullable: false })
  userType!: UserTypes;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
