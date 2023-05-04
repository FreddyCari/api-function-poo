import { Router } from 'express';
import {
  validateParamTenantMiddleware,
  validateSignInDtoMiddleware,
  passportAuthMiddleware,
} from '../middleware';
import { getUsersController, signInUserController } from '../controllers';

export const userRoutes = Router();

userRoutes.post(
  '/:tenant/signIn',
  [
    validateParamTenantMiddleware,
    validateSignInDtoMiddleware,
    passportAuthMiddleware('login'),
  ],
  signInUserController
);

userRoutes.get(
  '/:tenant/user',
  [validateParamTenantMiddleware, passportAuthMiddleware('jwt')],
  getUsersController
);
