import { IsNotEmpty } from 'class-validator';
import { RoleEntity } from '../../roles/role.entity';

export class UserDto {
  @IsNotEmpty()
  userName!: string;

  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  active!: boolean;

  @IsNotEmpty()
  role!: string;
  
  roleId?: RoleEntity;
}
