import { Injectable, HttpException, HttpStatus, Session } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import { hash } from 'bcryptjs';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesService } from 'src/roles/roles.service';
import { UserRoles } from 'src/roles/models/user-roles.model';
import { UserInfo } from './models/users-info.model';
import { TagsService } from 'src/tags/tags.service';
import { ChangeUserDto } from './dto/change-user.dto';
import { FilesService } from 'src/files/files.service';
import { UserSession } from 'src/sessions/models/user-session.model';
import { Role } from 'src/roles/models/roles.model';
import { BanUser } from 'src/banned/models/banned-users.model';
import { Tag } from 'src/tags/models/tag.model';
import { Question } from 'src/questions/models/question.model';
import { Block } from 'src/blocks/models/block.model';
import { CreateUserFollowingUsersDto } from './dto/create-user-following-user.dto';
import { UserFollowingUser } from './models/user-following-user.model';
import { DeleteUserFollowingUsersDto } from './dto/delete-user-following-user.dto';
import { Op } from 'sequelize';
import { Interview } from 'src/interviewes/models/interview.model';
import { Notification } from 'src/notifications/model/notification.model';
import { Settings } from 'src/settings/models/settings.model';
import { NotifiSettings } from 'src/settings/models/notifi-settings.model';
import { UserPost } from 'src/posts/models/user-post.model';
import { UserPostImage } from 'src/posts/models/user-post-images.model';
import { Achievement } from 'src/achievements/models/achievement.model';
import { EmailService } from 'src/email/email.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserOnline } from './models/user-online.model';

export const usersInclude = [
   { model: UserSession },
   { model: Role },
   { model: BanUser },
   { model: UserInfo },
   { model: Tag, as: 'tags' },
   { model: Tag, as: 'followingTags' },
   { model: Tag, as: 'ignoringTags' },
   { model: User, as: 'followingUsers' },
   { model: Question, as: 'questions' },
   { model: Block, as: 'blocks' },
   { model: Question, as: 'favouriteQuestions' },
   { model: Question, as: 'favouriteTestQuestions' },
   { model: Block, as: 'favouriteBlocks' },
   { model: Block, as: 'favouriteTestBlocks' },
   { model: User, as: 'favouriteUsers' },
   { model: User, as: 'favouriteCompanies' },
   { model: Tag, as: 'favouriteTags' },
   { model: Interview },
   { model: Notification },
   { model: Settings, include: [NotifiSettings] },
   { model: UserPost, include: [UserPostImage] },
   { model: Achievement },
   { model: UserOnline },
];

@Injectable()
export class UsersService {
   constructor(
      @InjectModel(User)
      private userRepository: typeof User,
      @InjectModel(UserRoles)
      private userRolesRepository: typeof UserRoles,
      @InjectModel(UserInfo)
      private userInfoRepository: typeof UserInfo,
      @InjectModel(UserFollowingUser)
      private userFollowingUserRepository: typeof UserFollowingUser,
      @InjectModel(Settings)
      private settingsRepository: typeof Settings,
      @InjectModel(NotifiSettings)
      private notifiSettingsRepository: typeof NotifiSettings,
      @InjectModel(UserSession)
      private userSessionRepository: typeof UserSession,
      @InjectModel(UserOnline)
      private userOnlineRepository: typeof UserOnline,
      private roleService: RolesService,
      private tagsService: TagsService,
      private filesService: FilesService,
      private emailService: EmailService,
   ) {}

   private readonly defaultAvatars = {
      male: [
         'andre.png',
         'ashton.png',
         'brad.png',
         'brini.png',
         'efron.png',
         'greggy.png',
         'greta.png',
         'lars.png',
         'marnie.png',
         'maxim.png',
         'nicola.png',
         'paul.png',
         'pitta.png',
         'raul.png',
         'rudiger.png',
         'sam.png',
         'theo.png,',
      ],
      female: [
         'babs.png',
         'camilla.png',
         'charlotte.png',
         'clara.png',
         'elsa.png',
         'elvira.png',
         'fini.png',
         'gene.png',
         'hanna.png',
         'laura.png',
         'leni.png',
         'ludmilla.png',
         'luisa.png',
         'phichi.png',
         'reana.png',
         'saskia.png',
         'serj.png',
         'tzu-yung.png',
      ],
   };

   async getAllUsers(limit: number, offset: number, search: string = '') {
      const users = await this.userRepository.findAll({
         offset: offset || 0,
         limit: limit || 100,
         include: usersInclude,
         where: {
            type: 'user',
            name: {
               [Op.like]: `%${search}%`,
            },
         },
         order: ['id'],
      });

      return users;
   }

   async getUserById(id: number, isCompanies: boolean = true): Promise<User> {
      const where = isCompanies ? { id } : { id, type: 'user' };

      const user = await this.userRepository.findOne({
         where,
         include: usersInclude,
      });

      return user;
   }

   async getUserByEmail(email: string) {
      const user = await this.userRepository.findOne({
         where: { email },
         include: usersInclude,
      });

      return user;
   }

   async createUser(userDto: CreateUserDto) {
      const password = await hash(userDto.password, 10);

      const user = await this.userRepository.create({
         ...userDto,
         avatar: userDto.gender
            ? this.getAvatar('user', userDto.gender)
            : this.getAvatar('company'),
         password,
      });

      if (userDto.type === 'user') {
         await this.addRole({ value: 'USER', userId: user.id });
         await this.userInfoRepository.create({
            userId: user.id,
            gender: userDto.gender,
         });
      } else {
         await this.addRole({ value: 'COMPANY', userId: user.id });
      }

      if (userDto.tags) {
         this.tagsService.createUserTags({
            userId: user.id,
            tags: userDto.tags,
         });
      }

      const settings = await this.settingsRepository.create({
         userId: user.id,
      });
      await this.notifiSettingsRepository.create({ settingsId: settings.id });

      return user;
   }

   async addRole(dto: AddRoleDto) {
      const user = await this.userRepository.findByPk(dto.userId);
      const role = await this.roleService.getRoleByValue(dto.value);

      if (role && user) {
         const userRole = {
            userId: dto.userId,
            roleId: role.id,
         };
         await this.userRolesRepository.create(userRole);
         return userRole;
      }

      throw new HttpException(
         'Пользователь или роль не найдены',
         HttpStatus.NOT_FOUND,
      );
   }

   async changeUser(dto: ChangeUserDto, summaryFile: Express.Multer.File) {
      const user = await this.userRepository.findByPk(dto.userId);

      for (let key in dto) {
         if (user[key] !== undefined) {
            user[key] = dto[key];
         }
      }

      if (user.summary) {
         this.filesService.deleteFile(user.summary.slice(1));
      }

      const summaryUrl = this.filesService.createFile(
         summaryFile,
         `users/${user.id}/summary`,
      );
      user.summary = summaryUrl;

      if (dto.tags) {
         if (user.tags) {
            await this.tagsService.changeUserTags({
               userId: user.id,
               tags: dto.tags,
            });
         } else {
            await this.tagsService.createUserTags({
               userId: user.id,
               tags: dto.tags,
            });
         }
      }

      return user.save();
   }

   async changeAvatar(avatar: Express.Multer.File, userId: number) {
      const user = await this.userRepository.findByPk(userId);

      if (user.avatar.slice(1, 16) !== 'avatars/default') {
         this.filesService.deleteFile(user.avatar.slice(1));
      }
      const avatarPath = this.filesService.createFile(
         avatar,
         `users/${userId}/avatar`,
      );

      user.avatar = avatarPath;
      return user.save();
   }

   async createUserFollowingUsers(dto: CreateUserFollowingUsersDto) {
      const { userId, followedUsers } = dto;
      const createdTags = [];
      const userFollows = await this.userFollowingUserRepository.findAll({
         where: { userId },
      });

      for (let followedUserId of followedUsers) {
         if (
            !userFollows
               .map((item) => item.followedUserId)
               .includes(+followedUserId)
         ) {
            createdTags.push(
               await this.userFollowingUserRepository.create({
                  userId,
                  followedUserId: +followedUserId,
               }),
            );
         }
      }

      return createdTags;
   }

   async deleteUserFollowingUsers(dto: DeleteUserFollowingUsersDto) {
      const deletedTags = [];
      const { followedUsers, userId } = dto;

      for (let followedUserId of followedUsers) {
         deletedTags.push({
            [followedUserId]: await this.userFollowingUserRepository.destroy({
               where: {
                  userId,
                  followedUserId: +followedUserId,
               },
            }),
         });
      }

      return deletedTags;
   }

   async changePassword(dto: ChangePasswordDto) {
      const { userId, verifyCode, newPassword } = dto;
      const verify = await this.emailService.checkVerifyCode(
         userId.toString(),
         verifyCode,
      );

      if (!verify) {
         throw new HttpException(
            'Неправильный код подтверждения, возможно он устарел',
            HttpStatus.BAD_REQUEST,
         );
      }

      const user = await this.userRepository.findOne({
         where: { id: userId },
         include: usersInclude,
      });
      const password = await hash(newPassword, 10);

      user.password = password;

      await this.userSessionRepository.destroy({ where: { userId } });

      return user.save();
   }

   async changeUserOnline(userId: number, status: boolean) {
      const online = await this.userOnlineRepository.findOrCreate({
         where: { userId },
      });

      online[0].online = status;

      return online[0].save();
   }

   private getAvatar(
      userType: 'company' | 'user',
      gender: 'male' | 'female' = undefined,
   ) {
      if (userType === 'company') {
         return '/avatars/default/companies/main.png';
      } else {
         if (gender === 'male') {
            return `/avatars/default/users/${gender}/${
               this.defaultAvatars.male[
                  this.getRandomNum(this.defaultAvatars.male.length)
               ]
            }`;
         } else if (gender === 'female') {
            return `/avatars/default/users/${gender}/${
               this.defaultAvatars.female[
                  this.getRandomNum(this.defaultAvatars.female.length)
               ]
            }`;
         }
      }
   }

   private getRandomNum(max: number): number {
      return Math.floor(Math.random() * max);
   }
}
