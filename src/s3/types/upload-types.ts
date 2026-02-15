export enum FileCategory {
    ARTICLE_COVER = 'covers',    // → Bucket: af-cover-image-articles
    ARTICLE_CONTENT = 'images',  // → Bucket: af-images-articles
}

export interface UploadFileOptions {
    category: FileCategory;
    fileName: string;
    fileBuffer: Buffer;
    mimeType: string;
}

export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB