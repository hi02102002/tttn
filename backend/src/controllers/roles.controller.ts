import { RolesService } from '@/services/roles.service';
import { catchAsync } from '@/utils/catch-async';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';

export class RolesController {
  rolesService = Container.get(RolesService);
  public getAllRoles = catchAsync(async (req, res) => {
    const roles = await this.rolesService.getAllRoles(req.query as any);

    res.status(StatusCodes.OK).json({
      message: 'Get all roles successfully',
      data: roles,
    });
  });

  public createRole = catchAsync(async (req, res) => {
    const role = await this.rolesService.createRole(req.body);

    res.status(StatusCodes.CREATED).json({
      message: 'Create role successfully',
      data: role,
    });
  });

  public updateRole = catchAsync(async (req, res) => {
    const role = await this.rolesService.updateRole(req.params.id as string, req.body);

    res.status(StatusCodes.OK).json({
      message: 'Update role successfully',
      data: role,
    });
  });

  public deleteRole = catchAsync(async (req, res) => {
    await this.rolesService.deleteRole(req.params.id);

    res.status(StatusCodes.OK).json({
      message: 'Remove role successfully',
      data: null,
    });
  });
}
