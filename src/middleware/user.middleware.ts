import { NextFunction, Request, Response } from 'express';
import { SignInUserDto } from '../modules/users/dto/signin-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpResponse } from '../shared/http.response';
import { traductorValidationError } from '../shared/traductor-error.validator';

export const validateSignInDtoMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let valid = new SignInUserDto();
  valid = plainToInstance(SignInUserDto, req.body);
  validate(valid, { whitelist: true, forbidNonWhitelisted: true }).then(
    (err) => {
      if (err.length > 0) {
        return HttpResponse.Error(res, traductorValidationError(err));
      } else {
        next();
      }
    }
  );
};
