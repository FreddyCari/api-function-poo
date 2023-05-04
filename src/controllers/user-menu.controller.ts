import { Request, Response } from 'express';
import { UserMenuService } from '../modules/menus/user-menu.service';
import { HttpResponse } from '../shared/http.response';

export const getUserMenuController = async (req: Request, res: Response) => {
  try {
    const userMenuService = new UserMenuService({
      tenantDB: req.params.tenant,
    });
    const data = await userMenuService.getAllUserMenu();
    return HttpResponse.Ok(res, data);
  } catch (error) {
    console.error(error);
    return HttpResponse.Error(res, error);
  }
};
