import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!!";
  }
  getHelloWorld(id: string): string {
    return `${id} Hello World!!!`;
  }
}
