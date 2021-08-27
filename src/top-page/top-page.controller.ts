import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page-dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TOP_PAGE_NOT_FOUND } from './top-page.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { HhService } from '../hh/hh.service';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Controller('top-page')
export class TopPageController {
  constructor(
    private readonly topPageService: TopPageService,
    private readonly hhService: HhService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return await this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.findByPageId(id);

    if (!page) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return page;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.findByAlias(alias);

    if (!page) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return page;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updatedPage = await this.topPageService.updateById(id, dto);
    if (!updatedPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return updatedPage;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedPage = await this.topPageService.deleteById(id);

    if (!deletedPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return await this.topPageService.findByFirstCategory(dto);
  }

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return await this.topPageService.findByText(text);
  }

  @Cron(CronExpression.EVERY_SECOND, { name: 'test' })
  async test() {
    const job = this.schedulerRegistry.getCronJob('test');
    Logger.log('Crone');
    // const data = await this.topPageService.findForHhUpdate(new Date());
    // for (const page of data) {
    //   page.hh = await this.hhService.getData(page.category);
    //   await this.sleep();
    //   await this.topPageService.updateById(page._id, page);
    // }
  }

  sleep() {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }
}
