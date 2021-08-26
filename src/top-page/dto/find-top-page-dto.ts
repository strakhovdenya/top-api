import { TopLevelCategory } from '../top-page.model';
import { IsObject } from 'class-validator';


export class FindTopPageDto {

  @IsObject()
  firstCategory: TopLevelCategory;
}
