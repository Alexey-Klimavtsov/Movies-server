import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class CreateReportDto {
    @ApiProperty()
    moviesCount: number;
    @ApiProperty()
    playlistsCount: number;
    @ApiProperty()
    usersCount: number;
}
