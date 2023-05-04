import * as jwt from 'jsonwebtoken';
import { UserEntity } from '../users/user.entity';
import { EnvironmentVariable } from '../../config/environment';
import { IJwtPayloadToken } from './jwt-payload.interface';

function sign(payload: IJwtPayloadToken, secret: any) {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export function generateJWT(workspace: string, user: UserEntity) {
  const payload: IJwtPayloadToken = {
    ws: workspace,
    sub: String(user.userId),
  };
  if (user) {
    user.password = '[>>protegido<<]';
  }
  return {
    accessToken: sign(payload, EnvironmentVariable.JWT_SECRET),
    user,
  };
}
