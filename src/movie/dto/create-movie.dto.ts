import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
    @ApiProperty()
    title: string;
    @ApiProperty()
    description?: string;
    @ApiProperty()
    year: number;
    @ApiProperty()
    length: number;
    @ApiProperty()
    producer: string;
    @ApiProperty()
    genre: string[];
}
