import { Controller, Get, Logger, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getAppName(): string {
    return 'dwapi Stats v03FEB211200';
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
