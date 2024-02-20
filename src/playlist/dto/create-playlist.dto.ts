import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaylistDto {
    @ApiProperty()
    title: string;
    @ApiProperty({ type: [String] })
    movies: string[];
    @ApiProperty()
    createdByUser: string;
    @ApiProperty()
    isPublic: boolean;
}
