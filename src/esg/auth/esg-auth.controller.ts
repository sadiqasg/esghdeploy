import { Body, Controller, Post } from '@nestjs/common';
import { EsgAuthService } from './esg-auth.service';
import { EsgSignupDto } from './dtos/esg-signup.dto';
import { ApiOperation } from '@nestjs/swagger';


@Controller('company/esg')
export class EsgAuthController {
  constructor(private readonly authService: EsgAuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new ESG company and company esg admin' })
  async signup(@Body() dto: EsgSignupDto) {
    return this.authService.signup(dto);
  }
}
