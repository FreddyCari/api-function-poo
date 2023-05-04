import { IsNotEmpty } from 'class-validator';

export class TenantDto {
  @IsNotEmpty()
  workspace!: string;

  @IsNotEmpty()
  email!: string;
}
