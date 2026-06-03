import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class PatchEmployeeDto {
  @ApiPropertyOptional({
    example: 'Samuel',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    example: 'Sierra',
  })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiPropertyOptional({
    example: 'samuel@test.com',
  })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiPropertyOptional({
    example: 'Backend Developer',
  })
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiPropertyOptional({
    example: 5000,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  salario?: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  companiaId?: number;
}

