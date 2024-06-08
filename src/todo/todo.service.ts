import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateTodoDto } from "src/dtos/dtos.dto";
import { Todo } from "src/schemas/todo.schema";
import { ObjectId } from "mongoose";
import { User } from "src/schemas/user.schema";

@Injectable()
export class TodoService {
  _id: ObjectId;
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<Todo>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async create(createTodoDto: CreateTodoDto, req): Promise<Todo> {
    createTodoDto.User = req.id;
    const createdCat = new this.todoModel(createTodoDto);
    return createdCat.save();
  }

  async findAll(req): Promise<Todo[]> {
    // const objectId = new Types.ObjectId(id);
    console.log(req.id);
    return await this.todoModel
      .find({ User: req.id })
      .populate({ path: "User", select: "name" });
  }

  async updateTodo(
    id: string,
    createTodoDto: CreateTodoDto,
    req
  ): Promise<Todo> {
    const todoId = new Types.ObjectId(id);

    const user = await this.userModel.findOne({ _id: req.id });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const todo = await this.todoModel.findOne({ _id: todoId });
    if (!todo) {
      throw new NotFoundException("Todo item not found");
    }
    if (user._id.toString() === todo.User.toString()) {
      return this.todoModel.findOneAndUpdate({ _id: todo._id }, createTodoDto, {
        new: true
      });
    } else {
      throw new ForbiddenException(
        "You are not allowed to perform this action"
      );
    }
  }
  async deleteTodo(id: string, req): Promise<Todo> {
    const todoId = new Types.ObjectId(id);

    const user = await this.userModel.findOne({ _id: req.id });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const todo = await this.todoModel.findOne({ _id: todoId });
    if (!todo) {
      throw new NotFoundException("Todo item not found");
    }
    if (user._id.toString() === todo.User.toString()) {
      return this.todoModel.findOneAndDelete({ _id: todoId });
    } else {
      throw new ForbiddenException(
        "You are not allowed to perform this action"
      );
    }
  }
}
