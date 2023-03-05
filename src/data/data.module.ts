import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { Companies } from './models/companies.model';
import { Positions } from './models/positions.model';
import { Sections } from './models/services.model';

@Module({
   controllers: [DataController],
   providers: [DataService],
   imports: [
      SequelizeModule.forFeature([Sections, Positions, Companies]),
      JwtModule.register({
         secret: process.env.PRIVATE_KEY,
         signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN,
         },
      }),
   ],
   exports: [DataService],
})
export class DataModule {}
