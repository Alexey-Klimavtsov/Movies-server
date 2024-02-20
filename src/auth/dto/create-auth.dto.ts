import { ApiProperty } from '@nestjs/swagger/dist';
export class CreateAuthDto {
    @ApiProperty({ required: true })
    email: string;
    @ApiProperty({ required: true })
    password: string;
}
