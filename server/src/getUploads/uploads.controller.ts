// Import necessary modules
import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { Public } from 'src/public.decorator';

@Public()
@Controller('uploads')
export class UploadsController {
  @Get(':filename')
  async serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const uploadsDir = path.join(__dirname, '..', '..', 'src/uploads'); // Go up two directories to reach the source code directory
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(path.join('src/uploads', filename))) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  }
}
