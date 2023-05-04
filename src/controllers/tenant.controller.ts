import { Request, Response } from 'express';
import { HttpResponse } from '../shared/http.response';
import { TenantService } from '../multi-tenancy/tenants/tenant.service';

export const signUpTenantController = async (req: Request, res: Response) => {
  try {
    const tenantService = new TenantService();
    const data = await tenantService.signUpTenant(req.body);
    return HttpResponse.Ok(res, data);
  } catch (error) {
    if ((error as Error).message) {
      const { message } = error as Error;
      return HttpResponse.Error(res, [{ errorMsg: message }]);
    }
    console.error(error);
    return HttpResponse.Error(res, error);
  }
};
