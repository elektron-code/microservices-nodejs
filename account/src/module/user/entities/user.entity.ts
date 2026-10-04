import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
@Index(['login', 'phone'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Идентификатор пользователя',
    name: 'user_id',
  })
  readonly userId: string;

  @Index()
  @Column('varchar', {
    comment: 'Логин пользователя',
    nullable: false,
  })
  login: string;

  @Column('varchar', {
    comment: 'Номер телефона пользователя',
    nullable: false,
    length: 20,
  })
  phone: string;

  @Column('varchar', { comment: 'Имя' })
  firstName: string;

  @Column('varchar', { comment: 'Фамилия' })
  lastName: string;

  @Column('varchar', { comment: 'Хеш пароля' })
  passwordHash: string;

  @Column('varchar', { comment: 'Соль пароля' })
  passwordSalt: string;

  @Column('varchar', {
    comment: 'Баланс',
    nullable: false,
    default: '0',
  })
  balance: string;

  @Column('boolean', {
    comment: 'Был ли удален аккаунт',
    nullable: true,
    default: false,
  })
  isDeleted: boolean;
}