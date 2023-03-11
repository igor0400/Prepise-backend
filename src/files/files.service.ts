import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Files } from 'src/questions/questions.controller';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
   defaultPath = '../../static/';

   createImgsAndFiles(files: Files, folderPath: string) {
      const returnedFiles = { files: [], images: [] };

      if (files.image) {
         files.image.forEach((image) => {
            this.checkFormat(image.mimetype);
            this.checkFileSize(image);

            const filePath = this.writeFile(image, `${folderPath}/images`);
            returnedFiles.images.push(filePath);
         });
      }

      if (files.file) {
         files.file.forEach((file) => {
            this.checkFileSize(file);

            const filePath = this.writeFile(file, `${folderPath}/files`);
            returnedFiles.files.push(filePath);
         });
      }

      return returnedFiles;
   }

   createImage(image: Express.Multer.File, folderPath: string) {
      this.checkFormat(image.mimetype);
      this.checkFileSize(image);

      return this.writeFile(image, folderPath);
   }

   createFile(file: Express.Multer.File, folderPath: string) {
      this.checkFileSize(file);

      return this.writeFile(file, folderPath);
   }

   createFiles(files: Express.Multer.File[], folderPath: string) {
      const returnedFiles = [];

      files.forEach((file) => {
         const filePath = this.createFile(file, `${folderPath}/files`);
         returnedFiles.push(filePath);
      });

      return returnedFiles;
   }

   deleteQuestionFiles(questionId: number) {
      const fileResolvePath = this.defaultPath + `/questions/${questionId}`;
      fs.rmdir(
         path.resolve(__dirname, fileResolvePath),
         { recursive: true },
         (error) => {
            if (error) {
               console.log(error);
               throw new HttpException(
                  `Ошибка удаления файлов: ${JSON.stringify(error)}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
               );
            }
            return 'Файлы удалены';
         },
      );
   }

   deleteFile(src: string) {
      try {
         const fileResolvePath = this.defaultPath + src.slice(1);
         fs.unlinkSync(path.resolve(__dirname, fileResolvePath));
         return 'Файл удален';
      } catch (error) {
         console.log(error);
         throw new HttpException(
            `Ошибка удаления файла: ${JSON.stringify(error)}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   private checkFileSize(file: Express.Multer.File) {
      const fileSize = +process.env.FILES_MAX_SIZE_IN_MB * 1024 * 1024 * 8;

      if (file.size > fileSize) {
         throw new HttpException(
            `Размер файла превышает ${process.env.FILES_MAX_SIZE_IN_MB}МБ`,
            HttpStatus.BAD_REQUEST,
         );
      }
   }

   private writeFile(file: Express.Multer.File, folderPath: string) {
      const fileFormat = file.originalname.split('.')[1];

      try {
         const fileName = uuid() + `.${fileFormat}`;
         const fileResolvePath = this.defaultPath + folderPath;
         const filePath = path.resolve(__dirname, fileResolvePath);

         if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
         }
         fs.writeFileSync(path.join(filePath, fileName), file.buffer);
         return `/${folderPath}/${fileName}`;
      } catch (e) {
         throw new HttpException(
            'Произошла ошибка при записи файла',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   private checkFormat(imageFormat: string) {
      const fileType = imageFormat.split('/')[0];
      
      if (fileType !== 'image') {
         throw new HttpException(
            `Формат изображения типа ${fileType} не поддерживается`,
            HttpStatus.BAD_REQUEST,
         );
      }
   }
}
