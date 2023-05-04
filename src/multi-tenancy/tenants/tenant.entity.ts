import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tenants' })
export class TenantEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  tenantId!: number;

  @Column({ unique: true })
  workspace!: string;

  @Column()
  email!: string;
}
