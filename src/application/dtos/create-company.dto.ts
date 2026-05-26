import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'OpenAI',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: 'Bogotá',
  })
  @IsString()
  @IsNotEmpty()
  direccion!: string;

  @ApiProperty({
    example: '3001234567',
  })
  @IsString()
  @IsNotEmpty()
  telefono!: string;
}