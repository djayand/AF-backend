import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { FileCategory, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from './types/upload-types';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class S3Service {
    private readonly logger = new Logger(S3Service.name);
    private readonly s3Client: S3Client;
    private readonly bucketCovers: string;
    private readonly bucketImages: string;
    private readonly urlCovers: string;
    private readonly urlImages: string;
    private readonly region: string;

    constructor(private readonly configService: ConfigService) {
        this.region = this.configService.get<string>('AWS_REGION');
        this.bucketCovers = this.configService.get<string>('AWS_S3_BUCKET_COVERS');
        this.bucketImages = this.configService.get<string>('AWS_S3_BUCKET_IMAGES');
        this.urlCovers = this.configService.get<string>('AWS_S3_URL_COVERS');
        this.urlImages = this.configService.get<string>('AWS_S3_URL_IMAGES');

        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
            forcePathStyle: false,
        });

        this.logger.log(`S3 Service initialized`);
        this.logger.log(`Covers bucket: ${this.bucketCovers}`);
        this.logger.log(`Images bucket: ${this.bucketImages}`);
    }

    private validateImageFile(file: Express.Multer.File): void {
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            throw new HttpException(
                `Type de fichier non autorisé. Types acceptés: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
                HttpStatus.BAD_REQUEST
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new HttpException(
                `Fichier trop volumineux. Taille max: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
                HttpStatus.BAD_REQUEST
            );
        }
    }

    private generateFileName(originalName: string): string {
        const extension = originalName.split('.').pop();
        const timestamp = Date.now();
        const uniqueId = uuidv4();
        return `${timestamp}-${uniqueId}.${extension}`;
    }

    private getBucketAndUrl(category: FileCategory): { bucket: string; baseUrl: string } {
        switch (category) {
            case FileCategory.ARTICLE_COVER:
                return { bucket: this.bucketCovers, baseUrl: this.urlCovers };
            case FileCategory.ARTICLE_CONTENT:
                return { bucket: this.bucketImages, baseUrl: this.urlImages };
            default:
                throw new HttpException('Catégorie invalide', HttpStatus.BAD_REQUEST);
        }
    }

    async uploadFile(
        file: Express.Multer.File,
        category: FileCategory
    ): Promise<UploadResponseDto> {
        try {
            this.validateImageFile(file);

            const fileName = this.generateFileName(file.originalname);
            const { bucket, baseUrl } = this.getBucketAndUrl(category);
            const key = fileName;

            this.logger.log(`Uploading to bucket: ${bucket}, key: ${key}`);

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await this.s3Client.send(command);

            const url = `${baseUrl}/${key}`;

            this.logger.log(`File uploaded successfully: ${url}`);

            return {
                url,
                key,
                size: file.size,
                mimeType: file.mimetype,
            };
        } catch (error) {
            this.logger.error(`Upload failed: ${error.message}`, error.stack);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                'Erreur lors de l\'upload du fichier',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async uploadArticleCover(file: Express.Multer.File): Promise<UploadResponseDto> {
        return this.uploadFile(file, FileCategory.ARTICLE_COVER);
    }

    async uploadArticleImage(file: Express.Multer.File): Promise<UploadResponseDto> {
        return this.uploadFile(file, FileCategory.ARTICLE_CONTENT);
    }

    async deleteFile(bucket: string, key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            await this.s3Client.send(command);
            this.logger.log(`File deleted successfully from ${bucket}: ${key}`);
        } catch (error) {
            this.logger.error(`Delete failed: ${error.message}`, error.stack);
            throw new HttpException(
                'Erreur lors de la suppression du fichier',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    extractKeyFromUrl(url: string): string | null {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname.substring(1);
        } catch {
            return null;
        }
    }
}