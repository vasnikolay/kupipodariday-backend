import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OwnerPasswordInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Wish | Wish[]> {
    return next.handle().pipe(
      map((data: Wish | Wish[]) => {
        if (!data) return;
        if (Array.isArray(data)) {
          return data.map((item) => {
            delete item.owner.password;
            return item;
          });
        }
        delete data.owner.password;
        return data;
      }),
    );
  }
}
