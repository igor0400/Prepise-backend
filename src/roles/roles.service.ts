import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './models/roles.model';
import { ChangeRoleDto } from './dto/change-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}
  async getAllRoles() {
    const roles = await this.roleRepository.findAll({
      include: { all: true },
    });
    return roles;
  }

  async getRoleById(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    return role;
  }

  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }

  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async changeRole(dto: ChangeRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { id: dto.roleId },
    });

    for (let key in dto) {
      if (role[key]) {
        role[key] = dto[key];
      }
    }

    return role.save();
  }
}
