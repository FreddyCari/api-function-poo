import * as dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV !== undefined
      ? `.${process.env.NODE_ENV.trim()}.env`
      : '.env',
});

export enum AdminType {
  ROLE_ADMIN = 'ADMIN',
  USER_ADMIN = 'admin',
}

export enum UserTypes {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ROLE = 'ROLE',
}

export class EnvironmentVariable {
  constructor() {
    throw new Error('No debe instanciar esta clase');
  }

  static nvl<T>(value: T | undefined, valueDefault: T): T {
    if (!value) return valueDefault;
    return value;
  }

  static get DB_TYPE(): 'mariadb' {
    return 'mariadb';
  }

  static get DB_HOST(): string {
    return this.nvl(process.env.DB_HOST, 'localhost');
  }

  static get DB_PORT(): number {
    return this.nvl(Number(process.env.DB_PORT), 0);
  }

  static get DB_USER(): string {
    return this.nvl(process.env.DB_USER, '');
  }

  static get DB_PASSWORD(): string {
    return this.nvl(process.env.DB_PASSWORD, '');
  }

  static get DB_DATABASE_MASTER(): string {
    return this.nvl(process.env.DB_DATABASE_MASTER, '');
  }

  static get DB_DATABASE_TENANT(): string {
    return this.nvl(process.env.DB_DATABASE_TENANT, '');
  }

  static get APP_PORT(): number {
    return this.nvl(Number(process.env.APP_PORT), 3000);
  }

  static get APP_ENV(): string {
    return this.nvl(process.env.APP_ENV, '');
  }

  static get APP_MASTER_SYN(): boolean {
    return this.nvl(Boolean(process.env.APP_MASTER_SYN), false);
  }

  static get APP_TENANT_SYN(): boolean {
    return this.nvl(Boolean(process.env.APP_TENANT_SYN), false);
  }

  static get JWT_SECRET(): string {
    return this.nvl(process.env.JWT_SECRET, 'secreto');
  }
}
