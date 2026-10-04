import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class UserDto {
  @ApiProperty({ description: 'Идентификатор пользователя', required: true, type: String })
  @Expose()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Логин пользователя', required: true, type: String })
  @Expose()
  @IsString()
  login: string;

  @ApiProperty({ description: 'Телефон пользователя', required: true, type: String })
  phone: string;

  @ApiProperty({ description: 'Имя пользователя', required: true, type: String })
  firstName: string;

  @ApiProperty({ description: 'Фамилия пользователя', required: true, type: String })
  lastName: string;

  @ApiProperty({ description: 'Отчество пользователя', required: true, type: String })
  middleName: string;

  @ApiProperty({ description: 'E-mail пользователя', required: true, type: String })
  email: string;

  constructor(entity: Partial<UserEntity>) {
    return plainToInstance(UserDto, entity, { excludeExtraneousValues: true });
  }
}