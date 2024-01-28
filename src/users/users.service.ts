import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.password = await this.hashService.getHashPassword(
      createUserDto.password,
    );
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = updateUserDto.hasOwnProperty('password')
      ? {
          ...updateUserDto,
          password: await this.hashService.getHashPassword(
            updateUserDto.password,
          ),
        }
      : updateUserDto;
    const user = await this.userRepository.update({ id }, updatedUser);

    if (user.affected === 0) {
      throw new BadRequestException('Update failed');
    }
    return await this.findById(id);
  }

  async findMany(query: string): Promise<User[]> {
    return await this.userRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
  }

  async findWishes(id: number): Promise<Wish[]> {
    const { wishes } = await this.userRepository.findOne({
      where: { id },
      relations: { wishes: true },
    });

    return wishes;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }
}
