import { DataSourceOptions } from 'typeorm';
import { EnvironmentVariable } from '../config/environment';
import { TenantEntity } from '../multi-tenancy/tenants/tenant.entity';
import { UserEntity } from '../modules/users/user.entity';
import { RoleEntity } from '../modules/roles/role.entity';
import { AccessEntity } from '../multi-tenancy/access/access.entity';
import { UserMenuEntity } from '../modules/menus/user-menu.entity';

export const ConfigMaster: DataSourceOptions = {
  type: EnvironmentVariable.DB_TYPE,
  host: EnvironmentVariable.DB_HOST,
  port: EnvironmentVariable.DB_PORT,
  username: EnvironmentVariable.DB_USER,
  password: EnvironmentVariable.DB_PASSWORD,
  database: EnvironmentVariable.DB_DATABASE_MASTER,
  entities: [TenantEntity, AccessEntity],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  // ssl: { rejectUnauthorized: true },
  // namingStrategy: new EstrategiaNombresDB(),
};

export const ConfigTenant: DataSourceOptions = {
  type: EnvironmentVariable.DB_TYPE,
  host: EnvironmentVariable.DB_HOST,
  port: EnvironmentVariable.DB_PORT,
  username: EnvironmentVariable.DB_USER,
  password: EnvironmentVariable.DB_PASSWORD,
  database: EnvironmentVariable.DB_DATABASE_TENANT,
  entities: [UserEntity, RoleEntity, UserMenuEntity],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  // ssl: { rejectUnauthorized: true },
  // namingStrategy: new EstrategiaNombresDB(),
};
