import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, LoginUserDto } from "src/dtos/dtos.dto";
import * as bcrypt from "bcrypt";
import { AuthService } from "src/auth/auth.service";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("user")
export class UserController {
  constructor(
    readonly userService: UserService,
    readonly authService: AuthService
  ) {}
  @Post("register")
  async create(@Res() res, @Body() createUserDto: CreateUserDto) {
    try {
      const response = await this.userService.register(createUserDto);
      return res
        .status(201)
        .json({ msg: "user create successfully", data: response });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  /**
   * @route POST /user/login
   * @method POST
   * @desc login User
   */
  @Post("login")
  async login(@Res() res, @Body() loginUserDto: LoginUserDto) {
    try {
      const userData = await this.userService.login(loginUserDto);
      console.log(userData);
      const token = this.authService.generateToken(
        userData._id,
        userData.email
      );
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        })
        .status(200)
        .json({ userData: userData, msg: "you login successfully" });
    } catch (err) {
      return res.status(401).json({ msg: err.message });
    }
  }
  @UseGuards(AuthGuard)
  @Get("getinfo")
  async getInfo(@Res() res, @Req() req) {
    try {
      const userInfo = await this.userService.findOne(req.id);
      const { name, headline, profileImageUrl } = userInfo;
      res
        .status(200)
        .json({
          userInfo: { name, headline, profileImageUrl },
          msg: "you get data successfully"
        });
    } catch (err) {
      return res.status(401).json({ msg: err.message });
    }
  }
  @Post("logout")
  async logout(@Res() res) {
    try {
      res
        .cookie("token", "token", {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          expires: new Date(Date.now())
        })
        .status(200)
        .json({ status: "ok", msg: "you logout successfully" });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
}
