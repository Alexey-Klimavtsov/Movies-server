import { ApiProperty } from '@nestjs/swagger/dist';
export class CreateLinkAuthDto {
    @ApiProperty({ required: true })
    email: string;
}
