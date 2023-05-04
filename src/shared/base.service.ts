import { BaseEntity, DataSource, EntityTarget, QueryRunner } from 'typeorm';
import { ConfigMaster, ConfigTenant } from '../databases/db';
import { EnvironmentVariable } from '../config/environment';

export class BaseService<T extends BaseEntity> {
  protected readonly AppDataSource: DataSource;
  protected readonly tenantDB: string;
  protected AppQueryRunner?: QueryRunner;
  constructor(
    getEntity: EntityTarget<T>,
    Options: { tenantDB: string; synchronizeEntities: boolean }
  );
  constructor(getEntity: EntityTarget<T>, appDataSource: DataSource);
  constructor(
    private readonly getEntity: EntityTarget<T>,
    Options: { tenantDB: string; synchronizeEntities: boolean } | DataSource
  ) {
    if (Options instanceof DataSource) {
      this.AppDataSource = Options;
      this.tenantDB = Options.options.database as string;
    } else {
      let config;
      if (Options.tenantDB === EnvironmentVariable.DB_DATABASE_MASTER) {
        config = { ...ConfigMaster };
      } else {
        config = { ...ConfigTenant };
      }
      this.tenantDB = Options.tenantDB;
      config.database = this.tenantDB;
      config.synchronize = Options.synchronizeEntities;
      this.AppDataSource = new DataSource(config);
    }
    this.AppQueryRunner = undefined;
  }

  protected async initDataBase(queryRunner: boolean = false): Promise<void> {
    if (this.AppDataSource.isInitialized) {
      if (queryRunner)
        this.AppQueryRunner = this.AppDataSource.createQueryRunner();
      return;
    }
    await this.AppDataSource.initialize().then(() => {
      console.log(
        `Base de datos '${this.tenantDB}' iniciado ${
          this.getEntity.toString().split(String.fromCharCode(32))[1]
        }`
      );
      if (queryRunner)
        this.AppQueryRunner = this.AppDataSource.createQueryRunner();
    });
  }

  protected get repositoryEntity() {
    if (!this.AppDataSource.isInitialized)
      throw Error('No tiene inicializado la base de datos');
    if (this.getEntity === BaseEntity)
      throw Error('No tiene asignado una Entidad');
    return this.AppDataSource.getRepository(this.getEntity);
  }

  protected get manager() {
    if (!this.AppDataSource.isInitialized)
      throw Error('No tiene inicializado la base de datos');
    return this.AppDataSource.manager;
  }

  protected async closeDataBase() {
    if (this.AppDataSource.isInitialized) {
      if (this.AppQueryRunner)
        if (!this.AppQueryRunner.isReleased) {
          if (this.AppQueryRunner.isTransactionActive)
            await this.AppQueryRunner.rollbackTransaction();
          await this.AppQueryRunner.release();
        }
      await this.AppDataSource.destroy();
    }
  }
}
