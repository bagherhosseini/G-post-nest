import { Injectable } from '@nestjs/common';
import { renameSync } from 'fs';
import path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async imgStorage(file: Express.Multer.File) {
    try {
      if (file) {
        //get user info (to and from)
        const Newname = path.join(
          __dirname,
          '../../uploads/' +
            Math.floor(
              Math.random() * (1000000000000000 - 100000000000000 + 1) +
                100000000000000,
            ),
        );
        const name = '../uploads/' + file.originalname;
        const oldPath = file.path;
        renameSync(oldPath, Newname);
        return name;
      }
    } catch (err) {
      return err;
    }
  }
}
