import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import  GetUserFilterDto  from './dto/get-users-filter.dto';
import { UserDto } from './dto/user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ChangeBalanceDto } from './dto/change-balance.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.userService.create(createUserDto);
  }

  @Post('/balance')
  balance(@Body() body: ChangeBalanceDto): Promise<void> {
    return this.userService.changeBalance(body);
  }

  @Get()
  findAll(
    @Query() getUserFilterDto: GetUserFilterDto,
  ): Promise<{ items: UserDto[]; total: number }> {
    return this.userService.findAll(getUserFilterDto);
  }

  @Get('/verification')
  verification(@Query() dto: SignInDto): Promise<boolean> {
    return this.userService.verification(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}