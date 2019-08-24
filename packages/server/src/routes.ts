import { Routes } from 'nest-router';
import { RegistriesModule } from './application/registries';
import { TransfersModule } from './application/transfers/transfers.module';
import { CourtsModule } from './application/courts/courts.module';

export const routes: Routes = [
  {
    path: 'api/v1/registries',
    module: RegistriesModule,
  },
  {
    path: 'api/v1/transfers',
    module: TransfersModule,
  },
  {
    path: 'api/v1/courts',
    module: CourtsModule,
  },
];