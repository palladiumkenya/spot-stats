import { Controller, Get, Logger, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getAppName(): any {
    return {
      name: 'Dwapi Spot-Stats',
      build: '11MAY21',
      staus: 'running',
    };
  }

  @Get('version')
  getAppVersion(): string {
    return '1.0.0';
  }

  @Get('stats')
  getLib(@Res() res): string {
    Logger.log(__dirname + '/wwwroot/stats.js');
    return res.sendFile(__dirname + '/wwwroot/stats.js');
  }
}
