import { ExtractDto } from './extract.dto';
export interface DocketDto {
    _id?: string;
    name?: string;
    display?: string;
    extracts?: ExtractDto[];
}
