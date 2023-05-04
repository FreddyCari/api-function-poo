import * as bcrypt from 'bcrypt';
import { EnvironmentVariable, AdminType } from '../../config/environment';
import { BaseService } from '../../shared/base.service';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { SignUpTenantDto } from '../../multi-tenancy/tenants/dto/signup-tenant.dto';
import { RoleService } from '../roles/role.service';
import { DataSource } from 'typeorm';

export class UserService extends BaseService<UserEntity> {
  private readonly roleService: RoleService;
  constructor(Options: { tenantDB: string; synchronizeEntities?: boolean });
  constructor(appDataSource: DataSource);
  constructor(
    options: { tenantDB: string; synchronizeEntities?: boolean } | DataSource
  ) {
    if (options instanceof DataSource) {
      super(UserEntity, options);
    } else {
      options.synchronizeEntities = EnvironmentVariable.nvl(
        options.synchronizeEntities,
        EnvironmentVariable.APP_TENANT_SYN
      );
      super(UserEntity, {
        tenantDB: options.tenantDB,
        synchronizeEntities: options.synchronizeEntities,
      });
    }
    this.roleService = new RoleService(this.AppDataSource);
  }

  async onCreateTenant(signUpTenantDto: SignUpTenantDto) {
    let role = await this.roleService.findByRole(AdminType.ROLE_ADMIN);
    if (!role)
      role = await this.roleService.createRole({
        role: AdminType.ROLE_ADMIN,
      });
    await this.createUser({
      userName: AdminType.USER_ADMIN,
      email: signUpTenantDto.email,
      password: signUpTenantDto.password,
      active: true,
      role: role!.role,
      roleId: role,
    });
  }

  private _findByUserName(userName: string, includePassword: boolean = false) {
    return this.repositoryEntity
      .createQueryBuilder('user')
      .addSelect(includePassword ? 'user.password' : 'user.*')
      .where({ userName })
      .getOne();
    // aparte de devolver los datos del usuario también me muestra el password,
    // si coloco user.* el password lo excluye por causa del "@Column({ select: false })" en UserEntity
  }

  async createUser(userDto: UserDto) {
    try {
      await this.initDataBase();
      const user = await this._findByUserName(userDto.userName.toLowerCase());
      if (user)
        throw new Error(
          `¡El usuario '${userDto.userName}' ya está registrado!`
        );
      const newUser = this.repositoryEntity.create(userDto);
      newUser.userName = newUser.userName.toLowerCase();
      const hashPass = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashPass;
      await this.repositoryEntity.insert(newUser);
      await this.closeDataBase();
      return newUser;
    } catch (error) {
      await this.closeDataBase();
      if ((error as Error).message) {
        const { message } = error as Error;
        throw new Error(message);
      }
    }
  }

  async validateUser(userName: string, password: string) {
    try {
      await this.initDataBase();
      const user = await this._findByUserName(userName, true);
      await this.closeDataBase();
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return user;
        }
      }
      return null;
    } catch (error) {
      await this.closeDataBase();
      if ((error as Error).message) {
        const { message } = error as Error;
        throw new Error(message);
      }
    }
  }

  async findUserById(userId: number) {
    await this.initDataBase();
    const users = await this.repositoryEntity.findOneBy({ userId });
    await this.closeDataBase();
    return users;
  }

  async findAllUsers() {
    await this.initDataBase();
    const users = await this.repositoryEntity.find();
    await this.closeDataBase();
    return users;
  }
}
