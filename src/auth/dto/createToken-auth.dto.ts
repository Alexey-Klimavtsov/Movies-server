import { ApiProperty } from '@nestjs/swagger/dist';
export class CreateTokenAuthDto {
    @ApiProperty({ required: true })
    email: string;
    @ApiProperty({ required: true })
    _id: string;
    @ApiProperty({ required: true })
    roles: string[];
}
