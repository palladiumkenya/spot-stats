import { Extract } from './extract';

export interface Docket {
  _id?: string;
  extracts?: Extract[];
  name?: string;
  display?: string;
}
