import { isAlpha } from 'class-validator';
import { EnvironmentVariable } from '../../config/environment';
import { BaseService } from '../../shared/base.service';
import { UserService } from '../../modules/users/user.service';
import { SignUpTenantDto } from './dto/signup-tenant.dto';
import { TenantEntity } from './tenant.entity';

export class TenantService extends BaseService<TenantEntity> {
  constructor() {
    super(TenantEntity, {
      tenantDB: EnvironmentVariable.DB_DATABASE_MASTER,
      synchronizeEntities: EnvironmentVariable.APP_MASTER_SYN,
    });
  }

  private _findByWorkspace(workspace: string) {
    if (!isAlpha(workspace)) {
      throw new Error(
        `workspace: Debe contener solamente letras (a-zA-Z). Valor ingresado:'${workspace}'`
      );
    }
    return this.repositoryEntity
      .createQueryBuilder('tenant')
      .addSelect('tenant.*')
      .where({ workspace: workspace.toLowerCase() })
      .getOne();
  }

  async notFoundWorkspace(workspace: string): Promise<boolean> {
    await this.initDataBase();
    const tenant = await this._findByWorkspace(workspace);
    await this.closeDataBase();
    return tenant === null;
  }

  async signUpTenant(signUpDto: SignUpTenantDto) {
    try {
      await this.initDataBase(true);
      const tenant = await this._findByWorkspace(signUpDto.workspace);
      if (tenant) {
        throw new Error(
          `¡El espacio de trabajo '${signUpDto.workspace}' ya está ocupado!`
        );
      }
      const newTenant = new TenantEntity();
      newTenant.workspace = signUpDto.workspace;
      newTenant.email = signUpDto.email;
      if (this.AppQueryRunner) {
        await this.AppQueryRunner.connect();
        await this.AppQueryRunner.query(
          `CREATE DATABASE IF NOT EXISTS ${newTenant.workspace}`
        );
        await this.AppQueryRunner.startTransaction();
        await this.AppQueryRunner.manager.insert(TenantEntity, newTenant);
        const userService = new UserService({
          tenantDB: newTenant.workspace,
          synchronizeEntities: true,
        });
        await userService.onCreateTenant(signUpDto);
        await this.AppQueryRunner.commitTransaction();
      }
      await this.closeDataBase();
      return newTenant;
    } catch (error) {
      await this.closeDataBase();
      if ((error as Error).message) {
        const { message } = error as Error;
        throw new Error(message);
      }
    }
  }
}
