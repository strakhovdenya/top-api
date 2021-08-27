import { Module } from '@nestjs/common';
import { TopPageService } from 'src/top-page/top-page.service';
import { SitemapController } from './sitemap.controller';
import { ConfigModule } from '@nestjs/config';
import { TopPageModule } from '../top-page/top-page.module';

@Module({
  controllers: [SitemapController],
  imports: [TopPageModule, ConfigModule],
})
export class SitemapModule {
}
