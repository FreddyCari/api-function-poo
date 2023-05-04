import { DataSource } from 'typeorm';
import { UserMenuEntity } from './user-menu.entity';
import { BaseService } from '../../shared/base.service';
import { EnvironmentVariable } from '../../config/environment';

export class UserMenuService extends BaseService<UserMenuEntity> {
  constructor(Options: { tenantDB: string; synchronizeEntities?: boolean });
  constructor(appDataSource: DataSource);
  constructor(
    options: { tenantDB: string; synchronizeEntities?: boolean } | DataSource
  ) {
    if (options instanceof DataSource) {
      super(UserMenuEntity, options);
    } else {
      options.synchronizeEntities = EnvironmentVariable.nvl(
        options.synchronizeEntities,
        EnvironmentVariable.APP_TENANT_SYN
      );
      super(UserMenuEntity, {
        tenantDB: options.tenantDB,
        synchronizeEntities: options.synchronizeEntities,
      });
    }
  }

  async getAllUserMenu() {
    await this.initDataBase();
    const userMenu = await this.repositoryEntity.find();
    await this.closeDataBase();
    return userMenu;
  }

  async createUserMenu() {
    //este método debería crear un nuevo UserMenu, esta incompleto
    await this.initDataBase();
    const userMenu = this.repositoryEntity.create({});
    await this.closeDataBase();
    return userMenu;
  }

}
