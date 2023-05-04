import { Request, Response } from 'express';
import { HttpResponse } from '../shared/http.response';
import { UserEntity } from '../modules/users/user.entity';
import { generateJWT } from '../modules/auth/sign.jwt';
import { UserService } from '../modules/users/user.service';

export const signInUserController = async (req: Request, res: Response) => {
  try {
    const userEncode = req.user as UserEntity;
    const encode = generateJWT(req.params.tenant, userEncode);
    if (!encode) {
      return HttpResponse.Unauthorized(res, { msgError: 'No tienes permisos' });
    }
    res.header('Content-Type', 'application/json');
    res.cookie('accessToken', encode.accessToken, { maxAge: 60000 * 60 });
    res.write(JSON.stringify(encode));
    res.end();
  } catch (error) {
    console.error(error);
    return HttpResponse.Error(res, error);
  }
};

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const userService = new UserService({ tenantDB: req.params.tenant });
    const data = await userService.findAllUsers();
    return HttpResponse.Ok(res, data);
  } catch (error) {
    console.error(error);
    return HttpResponse.Error(res, error);
  }
};
