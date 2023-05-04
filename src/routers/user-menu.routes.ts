import { Router } from 'express';
import { getUserMenuController } from '../controllers';
import { validateParamTenantMiddleware } from '../middleware';

export const userMenuRoutes = Router();

userMenuRoutes.get('/:tenant/userMenu', [validateParamTenantMiddleware], getUserMenuController);
