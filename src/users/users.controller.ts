import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Req,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserPasswordInterceptor } from '../interceptors/user-password.interceptor';
import { Request } from 'express';
import { User } from './entities/user.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(UserPasswordInterceptor)
  @Get('me')
  async getCurrentUser(@Req() req: Request & { user: User }) {
    return await this.usersService.findById(req.user.id);
  }

  @UseInterceptors(UserPasswordInterceptor)
  @Get(':username')
  async getUserByName(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseInterceptors(UserPasswordInterceptor)
  @Patch('me')
  async updateUser(
    @Req() req: Request & { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(req.user.id, updateUserDto);
  }

  @UseInterceptors(UserPasswordInterceptor)
  @Post('find')
  async findUser(@Body('query') query: string) {
    return await this.usersService.findMany(query);
  }
  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async findCurrentUserWishes(@Req() { user: { id } }) {
    return await this.usersService.findWishes(id);
  }

  @UseInterceptors(UserPasswordInterceptor)
  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findByUsername(username);
    return await this.usersService.findWishes(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return await this.usersService.deleteUser(id);
  }
}
