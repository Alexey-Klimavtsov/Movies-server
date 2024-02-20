import { ExportFormat } from '../enum/exportFormat.enum';
import * as csv from 'fast-csv';
import { NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../user/schemas/user.schema';
import { MovieDocument, Movie } from '../movie/schemas/movie.schema';
import { Readable } from 'stream';
import { writeFile } from 'fs/promises';
import * as path from 'path';

export function isValidateDate(dateString: string): boolean {
    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime());
}

export function formateData(format: string, data: User[] | Movie[] | null) {
    if (!data) throw new NotFoundException('Data is null');

    switch (format.toLowerCase()) {
        case ExportFormat.JSON:
            return JSON.stringify(data);
        case ExportFormat.CSV:
            return formatDataToCsv(data);
        default:
            throw new NotFoundException('Invalid format');
    }
}

function streamToString(stream: Readable): Promise<string> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () =>
            resolve(Buffer.concat(chunks).toString('utf-8')),
        );
        stream.on('error', reject);
    });
}

export async function formatDataToCsv(data: User[] | Movie[]): Promise<string> {
    const csvStream = csv.format({ headers: true });

    data.forEach((item) => {
        const csvRow = Object.values(item).map((value) =>
            JSON.stringify(value),
        );
        csvStream.write(csvRow);
    });

    csvStream.end();

    try {
        return await streamToString(csvStream);
    } catch (error) {
        console.error('Ошибка при преобразовании потока в строку:', error);
        throw error;
    } finally {
        csvStream.destroy();
    }
}

export async function writeToFile(filename: string, data: string) {
    await writeFile(filename, data);

    return true;
}
