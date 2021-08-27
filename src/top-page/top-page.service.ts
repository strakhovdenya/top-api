import { Injectable } from '@nestjs/common';
import { TopPageModel } from './top-page.model';
import { InjectModel } from 'nestjs-typegoose';
import { FindTopPageDto } from './dto/find-top-page-dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { addDays } from 'date-fns';
import { Types } from 'mongoose';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {
  }

  findByFirstCategory(dto: FindTopPageDto) {
    return this.topPageModel
      .aggregate([
        {
          $match: {
            firstCategory: dto.firstCategory,
          },
        },
        {
          $group: {
            _id: { secondCategory: '$secondCategory' },
            pages: { $push: { alias: '$alias', title: '$title' } },
          },
        },
      ])
      .exec();
  }

  findByPageId(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  findByText(text: string) {
    return this.topPageModel
      .find({
        $text: {
          $search: text,
          $caseSensitive: false,
        },
      })
      .exec();
  }

  findAll() {
    return this.topPageModel.find({}).exec();
  }

  deleteById(id: string) {
    return this.topPageModel.findByIdAndRemove(id).exec();
  }

  create(dto: CreateTopPageDto): Promise<TopPageModel> {
    return this.topPageModel.create(dto);
  }

  updateById(id: string | Types.ObjectId, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  findForHhUpdate(date: Date) {
    return this.topPageModel
      .find({
        firstCategory: 0,
        $or: [
          { 'hh.updatedAt': { $lt: addDays(date, -1) } },
          { 'hh.updatedAt': { $exists: false } },
        ],
      })
      .exec();
  }
}
