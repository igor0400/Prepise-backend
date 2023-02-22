import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './roles-auth.decorator';
import { ChangeRoleDto } from './dto/change-role.dto';

@Roles('ADMIN')
@UseGuards(RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}
  @Get()
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  getRoleById(@Param('id', ParseIntPipe) roleId: number) {
    const role = this.roleService.getRoleById(+roleId);

    if (role) {
      return role;
    } else {
      return `Роль с id: ${roleId} не найдена`;
    }
  }

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Patch(':id')
  changeRole(@Body() dto: ChangeRoleDto, @Param('id', ParseIntPipe) roleId: number) {
    return this.roleService.changeRole({ ...dto, roleId });
  }
}
