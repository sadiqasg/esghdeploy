import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto";
import { ApiBody } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @ApiBody({
        type: LoginDto,
        examples: {
            loginExample: {
                summary: "Example login input",
                value: {
                    email: "someone@email.com",
                    password: "password",
                },
            },
        },
    })
    @Post("login")
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
