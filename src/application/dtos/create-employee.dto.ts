import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  @IsNotEmpty()
  correo!: string;

  @IsString()
  @IsNotEmpty()
  cargo!: string;

  @IsNumber()
  @IsNotEmpty()
  salario!: number;

  @IsNumber()
  @IsNotEmpty()
  companiaId!: number;
}