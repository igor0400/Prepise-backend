import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateInitialDataDto } from './dto/create-initial-data.dto';
import { UsersService } from 'src/users/users.service';
import { Response, Request } from 'express';

@Injectable()
export class StartService {
   constructor(
      private authService: AuthService,
      private rolesService: RolesService,
      private usersService: UsersService,
   ) {}

   async createInitialData(
      dto: CreateInitialDataDto,
      response: Response,
      request: Request,
   ) {
      const userRole = await this.rolesService.createRole({
         value: 'USER',
         description: 'Пользователь',
      });

      const companyRole = await this.rolesService.createRole({
         value: 'COMPANY',
         description: 'Компания',
      });

      const adminRole = await this.rolesService.createRole({
         value: 'ADMIN',
         description: 'Администратор',
      });

      if (!userRole || !companyRole || !adminRole) {
         throw new UnauthorizedException('Ошибка создания роли');
      }

      const userData = await this.authService.createRegiserData(
         {
            ...dto,
            type: 'user',
            gender: 'male',
            emailVerifyCode: '111',
         },
         response,
         request,
      );

      if (!userData) {
         throw new UnauthorizedException('Ошибка создания пользователя');
      }

      await this.usersService.addRole({
         userId: userData.user.id,
         value: 'ADMIN',
      });

      return {
         userData,
         roles: {
            userRole,
            companyRole,
            adminRole,
         },
      };
   }
}
