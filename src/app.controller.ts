/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/hello")
  getHello(@Req() req, @Res() res): string {
    console.log(req.body);
    return res.status(200).send(this.appService.getHello());
    return this.appService.getHello();
  }
  @Post("/hello")
  getHelloWorld(@Query("namee") userName): any {
    console.log(userName);
    return this.appService.getHelloWorld(userName);
  }
  @Post("/hello/:age")
  getAge(@Param() age: number): any {
    return age;
  }
  @Post("/body")
  getBody(@Body() body): any {
    return body;
  }
}
