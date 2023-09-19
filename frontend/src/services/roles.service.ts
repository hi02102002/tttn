import { ENDPOINTS } from '@/constants';
import { httpClient } from '@/lib/axios';
import { TRole, TRoleDto, TRoleQuery } from '@/types/role';
import { TBaseResponse, TBaseService } from '@/types/shared';

class RolesService implements TBaseService {
   endpoint = ENDPOINTS.ROLES;
   getAllRoles(q?: TRoleQuery): Promise<
      TBaseResponse<{
         total: number;
         roles: Array<TRole>;
      }>
   > {
      return httpClient.get(`${this.endpoint}`, {
         params: q,
      });
   }

   createRole(data: TRoleDto): Promise<TBaseResponse<TRole>> {
      return httpClient.post(`${this.endpoint}`, data);
   }

   updateRole(id: string, data: TRoleDto): Promise<TBaseResponse<TRole>> {
      return httpClient.patch(`${this.endpoint}/${id}`, data);
   }

   deleteRole(id: string): Promise<TBaseResponse<null>> {
      return httpClient.delete(`${this.endpoint}/${id}`);
   }
}

export const rolesService = new RolesService();
