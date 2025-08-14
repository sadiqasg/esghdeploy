import { Module } from '@nestjs/common';
import { EsgAuthController } from './auth/esg-auth.controller';
import { EsgAuthService } from './auth/esg-auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [PrismaModule],
  controllers: [EsgAuthController],
  providers: [EsgAuthService, EmailService],
})
export class EsgModule {}