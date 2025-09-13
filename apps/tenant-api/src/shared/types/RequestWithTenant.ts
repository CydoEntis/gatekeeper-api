import { Request } from "express";
import { Tenant } from "./Tenant";

export interface RequestWithTenant extends Request {
  apiKey?: string;
  tenantId?: string;
  tenant?: Tenant;
}
