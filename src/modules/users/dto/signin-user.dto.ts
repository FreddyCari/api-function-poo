import { IsNotEmpty } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  userName!:string;

  @IsNotEmpty()
  password!: string;
}
