import {
  IsEmail,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';



export class RegisterDto {
  @IsEmail()
  correo!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  companiaId?: number;

  @IsOptional()
@IsString()
ciudad?: string;
}