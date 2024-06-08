import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import * as dotenv from "dotenv";
dotenv.config();
@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}` || `defaultSecretKey`, // Use your environment variable or a default value
      signOptions: { expiresIn: "60s" }
    })
  ],
  providers: [AuthService],
  controllers: [],
  exports: [AuthService]
})
export class AuthModule {}
