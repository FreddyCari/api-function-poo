import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class SignUpTenantDto {
  @IsNotEmpty()
  @Length(4, 20)
  @IsAlpha()
  workspace!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 3,
    minSymbols: 1,
    minUppercase: 3,
  })
  password!: string;
}
