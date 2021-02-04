import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Docket } from '../../domain/courts/docket';
import { docketSchema } from './schemas/docket.schema';
import { DocketRepository } from './docket.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Docket.name, schema: docketSchema }]),
  ],
  providers: [{ provide: 'IDocketRepository', useClass: DocketRepository }],
  exports: [{ provide: 'IDocketRepository', useClass: DocketRepository }],
})
export class CourtsInfrastructureModule {}
