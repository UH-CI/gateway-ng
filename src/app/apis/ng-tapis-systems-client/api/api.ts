export * from './credentials.service';
import { CredentialsService } from './credentials.service';
export * from './general.service';
import { GeneralService } from './general.service';
export * from './permissions.service';
import { PermissionsService } from './permissions.service';
export * from './systems.service';
import { SystemsService } from './systems.service';
export const APIS = [CredentialsService, GeneralService, PermissionsService, SystemsService];
