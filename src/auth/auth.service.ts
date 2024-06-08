import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  generateToken(id: any, email: any): string {
    const payload = { id: id, email: email };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: "30d"
    });
  }
  async verifyToken(req, res) {
    const { authorization: token } = req.headers;
    console.log(token);
    console.log("bla", req.cookies);
    if (!token) {
      throw new UnauthorizedException("please Login first");
    }
    try {
      const userPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });
      console.log(userPayload);
      req.id = userPayload.id;
      return userPayload;
    } catch (err) {
      return res.status(401).json({ msg: err.message });
    }
  }
}
