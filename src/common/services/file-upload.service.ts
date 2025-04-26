import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { join } from 'path';
import { createWriteStream } from 'fs';
import * as fs from 'fs/promises'; // for async mkdir

@Injectable()
export class FileUploadService {
  async uploadFile(
    file: FileUpload,
    destinationDir: string,
    filename: string,
  ): Promise<string> {
    const { createReadStream } = file;

    const uploadDir = join(
      process.cwd(),
      'public',
      'images',
      destinationDir,
    );
    const filePath = join(uploadDir, filename);

    try {
      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      // Save the file using streams
      return await new Promise((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(filePath))
          .on('finish', () => {
            resolve(`/public/images/${destinationDir}/${filename}`);
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new HttpException(
        'Failed to upload file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = join(process.cwd(), filePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new HttpException(
        'Failed to delete file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
