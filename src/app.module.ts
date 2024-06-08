/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UserController } from "./user/user.controller";
import { TodoService } from "./todo/todo.service";
import { TodoController } from "./todo/todo.controller";
import { Todo, TodoSchema } from "./schemas/todo.schema";
import { User, UserSchema } from "./schemas/user.schema";
import { UserService } from "./user/user.service";
import { AuthService } from "./auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [AppController, UserController, TodoController],
  providers: [
    AppService,
    TodoService,
    UserService,
    AuthService,
    JwtService
  ]
})
export class AppModule {}
