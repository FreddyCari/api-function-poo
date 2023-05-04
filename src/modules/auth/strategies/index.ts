import { JwtStrategy } from './jwt.strategy';
import { LoginStrategy } from './login.strategy';

export const AuthStrategies = [new LoginStrategy().use, new JwtStrategy().use];
