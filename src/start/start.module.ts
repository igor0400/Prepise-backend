import { Module } from '@nestjs/common';
import { StartController } from './start.controller';
import { StartService } from './start.service';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
   controllers: [StartController],
   providers: [StartService],
   imports: [AuthModule, RolesModule, UsersModule],
})
export class StartModule {}
