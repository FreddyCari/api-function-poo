import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { HttpResponse } from '../shared/http.response';
import { UserEntity } from '../modules/users/user.entity';
import { UserService } from '../modules/users/user.service';

export const passportAuthMiddleware = (type: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      type,
      { session: false },
      async (err: Error, user: UserEntity, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          if (info instanceof Error) {
            return HttpResponse.Error(res, { msgError: info.message });
          } else {
            return HttpResponse.Error(res, info);
          }
        }
        if (user instanceof UserEntity) {
          req.user = user;
        } else {
          if (req.params.tenant === user['ws']) {
            req.user = (await new UserService({
              tenantDB: req.params.tenant,
            }).findUserById(user['sub'])) as UserEntity;
          } else {
            return HttpResponse.Error(res, { msgError: 'No auth token [ws]' });
          }
        }
        return next();
      }
    )(req, res, next);
  };
};
