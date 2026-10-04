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
  @Expose()
  phone: string;

  @ApiProperty({ description: 'Имя пользователя', required: true, type: String })
  @Expose()
  firstName: string;

  @ApiProperty({ description: 'Фамилия пользователя', required: true, type: String })
  @Expose()
  lastName: string;

  @ApiProperty({ description: 'Отчество пользователя', required: true, type: String })
  @Expose()
  middleName: string;

  @ApiProperty({ description: 'Email пользователя', required: true, type: String })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Баланс пользователя', type: String })
  @IsString()
  @Expose()
  balance: string;

  constructor(entity: Partial<UserEntity>) {
    return plainToInstance(UserDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}