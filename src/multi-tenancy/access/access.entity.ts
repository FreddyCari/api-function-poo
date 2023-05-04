import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'access' })
export class AccessEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  accessId!: number;

  @Column({ unique: true })
  titleResource!: string;

  @Column()
  url!: string;

  @Column()
  freeAccess!: boolean;

  @Column()
  paidAccess!: boolean;

  @Column()
  active!: boolean;
}
