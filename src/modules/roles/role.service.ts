import { DataSource } from 'typeorm';
import { EnvironmentVariable } from '../../config/environment';
import { BaseService } from '../../shared/base.service';
import { RoleDto } from './dto/role.dto';
import { RoleEntity } from './role.entity';

export class RoleService extends BaseService<RoleEntity> {
  constructor(Options: { tenantDB: string; synchronizeEntities?: boolean });
  constructor(appDataSource: DataSource);
  constructor(
    options: { tenantDB: string; synchronizeEntities?: boolean } | DataSource
  ) {
    if (options instanceof DataSource) {
      super(RoleEntity, options);
    } else {
      options.synchronizeEntities = EnvironmentVariable.nvl(
        options.synchronizeEntities,
        EnvironmentVariable.APP_TENANT_SYN
      );
      super(RoleEntity, {
        tenantDB: options.tenantDB,
        synchronizeEntities: options.synchronizeEntities,
      });
    }
  }

  private _findByRole(role: string) {
    return this.repositoryEntity
      .createQueryBuilder('roles')
      .addSelect('roles.*')
      .where({ role })
      .getOne();
  }

  async findByRole(roleName: string) {
    try {
      await this.initDataBase();
      const role = await this._findByRole(roleName);
      await this.closeDataBase();
      return role;
    } catch (error) {
      await this.closeDataBase();
      if ((error as Error).message) {
        const { message } = error as Error;
        throw new Error(message);
      }
    }
  }

  async createRole(roleDto: RoleDto) {
    try {
      await this.initDataBase();
      const role = await this._findByRole(roleDto.role);
      if (role) throw new Error(`¡El rol '${role.role}' ya está registrado!`);
      const newRole = this.repositoryEntity.create(roleDto);
      await this.repositoryEntity.insert(newRole);
      await this.closeDataBase();
      return newRole;
    } catch (error) {
      await this.closeDataBase();
      if ((error as Error).message) {
        const { message } = error as Error;
        throw new Error(message);
      }
    }
  }
}
