import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("/water-box")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async GetState() {
    return this.appService.getState();
  }

  @Post()
  async registerAction(@Body() body: { sinal: number, liters?: number }) {
    try {
      this.appService.registerAction(body)

    } catch (error) {
      console.error(error);
    }
    return { ok: true }
  }
}
