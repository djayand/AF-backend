import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { UploadResponseDto } from './dto/upload-response.dto';

@ApiTags('S3 Uploads')
@Controller('s3')
export class S3Controller {
    private readonly logger = new Logger(S3Controller.name);

    constructor(private readonly s3Service: S3Service) { }

    /**
     * Upload une image de couverture d'article
     * POST /s3/upload/article-cover
     */
    @Post('upload/article-cover')
    @ApiOperation({ summary: 'Upload une image de couverture d\'article' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image de couverture (JPG, PNG, WEBP, GIF - max 5MB)',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadArticleCover(
        @UploadedFile() file: Express.Multer.File
    ): Promise<UploadResponseDto> {
        try {
            if (!file) {
                throw new HttpException('Aucun fichier fourni', HttpStatus.BAD_REQUEST);
            }

            this.logger.log(`Upload article cover: ${file.originalname} (${file.size} bytes)`);
            return await this.s3Service.uploadArticleCover(file);
        } catch (error) {
            this.logger.error('Error uploading article cover:', error.stack);
            throw error;
        }
    }

    /**
     * Upload une image de contenu d'article
     * POST /s3/upload/article-image
     */
    @Post('upload/article-image')
    @ApiOperation({ summary: 'Upload une image pour le contenu d\'un article' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image pour le contenu (JPG, PNG, WEBP, GIF - max 5MB)',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadArticleImage(
        @UploadedFile() file: Express.Multer.File
    ): Promise<UploadResponseDto> {
        try {
            if (!file) {
                throw new HttpException('Aucun fichier fourni', HttpStatus.BAD_REQUEST);
            }

            this.logger.log(`Upload article image: ${file.originalname} (${file.size} bytes)`);
            return await this.s3Service.uploadArticleImage(file);
        } catch (error) {
            this.logger.error('Error uploading article image:', error.stack);
            throw error;
        }
    }
}