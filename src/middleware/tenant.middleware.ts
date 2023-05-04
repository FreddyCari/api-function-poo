import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpResponse } from '../shared/http.response';
import { SignUpTenantDto } from '../multi-tenancy/tenants/dto/signup-tenant.dto';
import { traductorValidationError } from '../shared/traductor-error.validator';
import { TenantService } from '../multi-tenancy/tenants/tenant.service';

export const validateSignUpDtoMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let valid = new SignUpTenantDto();
  valid = plainToInstance(SignUpTenantDto, req.body);
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

export const validateParamTenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tenantService = new TenantService();
  if (await tenantService.notFoundWorkspace(req.params.tenant))
    return HttpResponse.Error(res, [
      { msgError: `Workspace '${req.params.tenant}' no encontrado` },
    ]);
  next();
};
