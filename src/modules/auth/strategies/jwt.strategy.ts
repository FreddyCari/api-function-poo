import passport from 'passport';
import { IJwtPayloadToken } from '../jwt-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariable } from '../../../config/environment';

export class JwtStrategy {
  private async validate(payload: IJwtPayloadToken, done: any) {
    return done(null, payload);
  }

  get use() {
    return passport.use(
      'jwt',
      new Strategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: EnvironmentVariable.JWT_SECRET,
          ignoreExpiration: false,
        },
        this.validate
      )
    );
  }
}
