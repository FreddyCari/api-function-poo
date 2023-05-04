import passport from 'passport';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { UserService } from '../../users/user.service';

export class LoginStrategy {
  private async validate(
    req: Request,
    userName: string,
    password: string,
    done: any
  ) {
    const userService = new UserService({ tenantDB: req.params.tenant });
    const user = await userService.validateUser(userName, password);
    if (!user) {
      return done(null, false, { msgError: 'Username o password invalido' });
    }
    return done(null, user);
  }

  get use() {
    return passport.use(
      'login',
      new Strategy(
        {
          usernameField: 'userName',
          passwordField: 'password',
          passReqToCallback: true,
        },
        this.validate
      )
    );
  }
}
