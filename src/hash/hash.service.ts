import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async getHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compareHashPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
