import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { CreateTodoDto } from "src/dtos/dtos.dto";
import { TodoService } from "./todo.service";
import { verify } from "crypto";
import { AuthService } from "src/auth/auth.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("todo")
export class TodoController {
  constructor(
    readonly userService: TodoService,
    readonly authService: AuthService
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Res() ress, @Body() createUserDto: CreateTodoDto, @Req() req) {
    try {
      const res = await this.userService.create(createUserDto, req);
      return ress
        .status(201)
        .json({ msg: "user create successfully", data: res });
    } catch (err) {
      return ress.status(400).json({ msg: err.message });
    }
  }
  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Res() res, @Req() req) {
    console.log("id", req.id);
    try {
      const response = await this.userService.findAll(req);
      return res
        .status(200)
        .json({ msg: "users Get successfully", data: response });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
  @UseGuards(AuthGuard)
  @Patch(":id")
  async update(
    @Res() res,
    @Req() req,
    @Param("id") id: string,
    @Body() createUserDto: CreateTodoDto
  ) {
    try {
      const response = await this.userService.updateTodo(
        id,
        createUserDto,
        req
      );
      return res
        .status(200)
        .json({ msg: "Todo Updata successfully", data: response });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
  @UseGuards(AuthGuard)
  @Delete(":id")
  async delete(@Res() res, @Req() req, @Param("id") id: string) {
    try {
      const response = await this.userService.deleteTodo(id, req);
      return res
        .status(200)
        .json({ msg: "Todo delete successfully", data: response });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
}
