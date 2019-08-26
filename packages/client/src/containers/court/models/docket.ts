import { Extract } from "./extract";

export interface Docket {
  _id?: string;
  name?: string;
  display?: string;
  extracts?: Extract[];
}
