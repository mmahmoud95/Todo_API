/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/dtos/dtos.dto";
import { User } from "src/schemas/user.schema";
import * as bcrypt from "bcrypt";
import { Builder, Browser, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

import { Options } from "selenium-webdriver/chrome";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async register(createUserDto: CreateUserDto): Promise<User> {
    if (
      !createUserDto.name ||
      !createUserDto.email ||
      !createUserDto.password
    ) {
      throw new Error("Name, email, and password are required");
    }

    const emailExist = await this.userModel.findOne({
      email: createUserDto.email
    });

    if (emailExist) {
      throw new Error("Email already exists");
    }

    const password = createUserDto.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    createUserDto.password = hashedPassword;
    await this.scrapLinkedinProfile(createUserDto);
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async login({ email, password }): Promise<any> {
    const isUserFound = await this.userModel.findOne({
      email: email
    });
    if (!isUserFound) {
      throw new Error("please register first,to can login");
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserFound.password
    );
    if (!isPasswordCorrect) {
      throw new Error("password is incorrect");
    }

    return isUserFound;
  }

  async scrapLinkedinProfile(createUserDto): Promise<any> {
    const options = new Options();
    options.addArguments("--headless");

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    console.log(typeof createUserDto.linkedinProfileUrl);
    try {
      console.log("LinkedIn Profile URL:", createUserDto.linkedinProfileUrl);
      await driver.get(createUserDto.linkedinProfileUrl);

      // Wait until the profile image is present
      const photoElement = await driver.wait(
        until.elementLocated(
          By.className("top-card__profile-image--real-image")
        ),
        20000
      );

      const srcPhoto = await photoElement.getAttribute("src");
      console.log(srcPhoto);
      createUserDto.profileImageUrl = srcPhoto || "No photo available";

      const headlineElement = await driver.findElement(
        By.className("top-card-layout__headline")
      );
      const headlineText = await headlineElement.getText();

      createUserDto.headline = headlineText || "No headline available";

      const nameElement = await driver.findElement(
        By.className("top-card-layout__title")
      );
      const profileName = await nameElement.getText();

      createUserDto.name = profileName || "No name available";
    } catch (error) {
      console.error("Error during scraping:", error);
    } finally {
      await driver.quit();
    }
  }
  async findOne(id): Promise<User> {
    return this.userModel.findOne({ _id: id }).exec();
  }
}
