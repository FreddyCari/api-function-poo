import { Router } from 'express';
import { validateSignUpDtoMiddleware } from '../middleware';
import { signUpTenantController } from '../controllers';

export const tenantRoutes = Router();

tenantRoutes.post(
  '/signUp',
  [validateSignUpDtoMiddleware],
  signUpTenantController
);
