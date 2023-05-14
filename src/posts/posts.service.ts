import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { ChangeUserPostDto } from './dto/change-user-post.dto';
import { CreateUserPostDto } from './dto/create-user-post.dto';
import { UserPostImage } from './models/user-post-images.model';
import { UserPost } from './models/user-post.model';

@Injectable()
export class PostsService {
   constructor(
      @InjectModel(UserPost)
      private userPostRepository: typeof UserPost,
      @InjectModel(UserPostImage)
      private userPostImageRepository: typeof UserPostImage,
      private fileService: FilesService,
   ) {}

   async getAllUserPosts(limit: number, offset: number, userId?: number) {
      const where = userId ? { userId } : undefined;

      const posts = await this.userPostRepository.findAll({
         offset: offset || 0,
         limit: limit || 20,
         where,
         include: [UserPostImage],
         order: ['id'],
      });
      return posts;
   }

   async createUserPost(dto: CreateUserPostDto, images: Express.Multer.File[]) {
      const post = await this.userPostRepository.create(dto);

      if (images.length) {
         for (let image of images) {
            const url = this.fileService.createImage(
               image,
               `posts/users/${post.id}`,
            );
            await this.userPostImageRepository.create({ postId: post.id, url });
         }
      }

      return post;
   }

   async changeUserPost(dto: ChangeUserPostDto) {
      const post = await this.userPostRepository.findOne({
         where: { id: dto.userPostId },
      });

      for (let key in dto) {
         if (post[key] !== undefined) {
            post[key] = dto[key];
         }
      }

      return post.save();
   }

   async deleteUserPost(postId: number, userId: number) {
      try {
         const post = await this.userPostRepository.findOne({
            where: { id: postId, userId },
         });
         const postImages = await this.userPostImageRepository.findAll({
            where: { postId: post.id },
         });

         await this.userPostRepository.destroy({ where: { id: postId } });

         for (let image of postImages) {
            await this.userPostImageRepository.destroy({
               where: { id: image.id },
            });
            this.fileService.deleteFile(image.url);
         }

         return `Пост с id: ${postId} успешно удален`;
      } catch (e) {
         throw new HttpException(
            `Ошибка удаления поста с id: ${postId}: ${JSON.stringify(e)}`,
            HttpStatus.FORBIDDEN,
         );
      }
   }
}
