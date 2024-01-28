import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserPasswordInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Omit<User, 'password'> | Omit<User, 'password'>[]> {
    return next.handle().pipe(
      map((data: User | User[]) => {
        if (!data) return;
        if (Array.isArray(data)) {
          return data.map((item) => {
            delete item.password;
            return item;
          });
        }
        delete data.password;
        return data;
      }),
    );
  }
}
