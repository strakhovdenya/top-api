import { Injectable } from '@nestjs/common';
import { TopPageModel } from './top-page.model';
import { InjectModel } from 'nestjs-typegoose';
import { FindTopPageDto } from './dto/find-top-page-dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page-dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {
  }

  findByFirstCategory(dto: FindTopPageDto) {
    return this.topPageModel.find({ firstCategory: dto.firstCategory }).exec();
  }

  findByPageId(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  create(dto: CreateTopPageDto): Promise<TopPageModel> {
    return this.topPageModel.create(dto);
  }

  updateById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
