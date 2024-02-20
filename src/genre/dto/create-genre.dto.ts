import { ApiProperty } from '@nestjs/swagger';
export class CreateGenreDto {
    @ApiProperty()
    title: string;
}
