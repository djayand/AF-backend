import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ description: 'URL publique du fichier uploadé' })
  url: string;

  @ApiProperty({ description: 'Clé S3 du fichier' })
  key: string;

  @ApiProperty({ description: 'Taille du fichier en bytes' })
  size: number;

  @ApiProperty({ description: 'Type MIME du fichier' })
  mimeType: string;
}