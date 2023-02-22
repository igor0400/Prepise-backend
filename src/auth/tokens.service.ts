import { UnprocessableEntityException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';

import { UserSession } from '../sessions/models/user-session.model';

import { UsersService } from 'src/users/users.service';

import { User } from 'src/users/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { SessionsService } from 'src/sessions/sessions.service';

export interface RefreshTokenPayload {
   jti: string;
   sub: string;
   userIp: string;
   userAgent: string;
}

export interface UserSessionOptions {
   userIp: string;
   userAgent: string;
}

interface CreateTokensType {
   accessToken: string;
   refreshToken: string;
   user: User;
}

export const refreshTokenTime = 1000 * 60 * 60 * 24 * 60;
export const refreshTokenTimeCookie = 60 * 24 * 60 * 60 * 1000;

@Injectable()
export class TokensService {
   public constructor(
      @InjectModel(UserSession)
      private userSessionRepository: typeof UserSession,
      private usersService: UsersService,
      private jwtService: JwtService,
      private sessionsService: SessionsService,
   ) {}

   public async generateAccessToken(user: User): Promise<string> {
      const opts: SignOptions = {
         subject: user.id.toString(),
      };

      return this.jwtService.signAsync({}, opts);
   }

   public async generateRefreshToken(
      user: User,
      refreshOpts: UserSessionOptions,
      expiresIn: number,
   ): Promise<string> {
      const userSession = await UserSession.findOne({
         where: {
            userId: user.id,
            ...refreshOpts,
         },
         include: { all: true },
      });

      const opts: SignOptions = {
         expiresIn,
         subject: user.id.toString(),
      };

      if (userSession) {
         await this.sessionsService.updateSession(userSession, expiresIn);

         return this.jwtService.signAsync(refreshOpts, {
            ...opts,
            jwtid: userSession.id.toString(),
         });
      } else {
         const newSession = await this.sessionsService.createSession(
            user.id,
            expiresIn,
            refreshOpts,
         );

         return this.jwtService.signAsync(refreshOpts, {
            ...opts,
            jwtid: newSession.id.toString(),
         });
      }
   }

   public async resolveUserSession(encoded: string): Promise<{ user: User }> {
      const payload = await this.decodeRefreshToken(encoded);

      const user = await this.getUserFromRefreshTokenPayload(payload);

      if (!user) {
         throw new UnprocessableEntityException(
            'Refresh токен неверного формата',
         );
      }

      return { user };
   }

   public async resolveUserFromAccessToken(
      encoded: string,
   ): Promise<{ user: User }> {
      const payload = await this.decodeAccessToken(encoded);

      const user = await this.getUserFromAccessTokenPayload(payload);

      if (!user) {
         throw new UnprocessableEntityException(
            'Access токен неверного формата',
         );
      }

      return { user };
   }

   public async createTokensFromRefreshToken(
      refresh: string,
      userAgent: string,
      userIp: string,
   ): Promise<CreateTokensType> {
      const { user } = await this.resolveUserSession(refresh);

      const userSession = await this.userSessionRepository.findOne({
         where: {
            userId: user.id,
            userIp,
            userAgent,
         },
         include: { all: true },
      });

      if (!userSession) {
         throw new UnprocessableEntityException('Refresh токен не найден');
      }

      if (
         Date.parse(userSession.expires.toISOString()) <
         Date.parse(new Date().toISOString())
      ) {
         throw new UnprocessableEntityException(
            'Срок действия refresh токена истек',
         );
      }

      const addOptions = { userIp, userAgent };

      this.sessionsService.updateSession(userSession, refreshTokenTime);

      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(
         user,
         addOptions,
         refreshTokenTime,
      );

      return { user, accessToken, refreshToken };
   }

   private async decodeRefreshToken(
      token: string,
   ): Promise<RefreshTokenPayload> {
      try {
         return this.jwtService.verifyAsync(token);
      } catch (e) {
         if (e instanceof TokenExpiredError) {
            throw new UnprocessableEntityException(
               'Истек срок действия refresh токена',
            );
         } else {
            throw new UnprocessableEntityException(
               'Refresh токен неверного формата',
            );
         }
      }
   }

   private async decodeAccessToken(
      token: string,
   ): Promise<{ iat?: number; exp?: number; sub: string }> {
      try {
         return this.jwtService.verifyAsync(token);
      } catch (e) {
         if (e) {
            throw new UnprocessableEntityException(
               'Истек срок действия access токена',
            );
         } else {
            throw new UnprocessableEntityException(
               'Access токен неверного формата',
            );
         }
      }
   }

   private async getUserFromRefreshTokenPayload(
      payload: RefreshTokenPayload,
   ): Promise<User> {
      const subId = payload.sub;

      if (!subId) {
         throw new UnprocessableEntityException(
            'Refresh токен неверного формата',
         );
      }

      return this.usersService.getUserById(+subId);
   }

   private async getUserFromAccessTokenPayload(payload: {
      iat?: number;
      exp?: number;
      sub: string;
   }): Promise<User> {
      const subId = payload.sub;

      if (!subId) {
         throw new UnprocessableEntityException(
            'Refresh токен неверного формата',
         );
      }

      return this.usersService.getUserById(+subId);
   }
}
