import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { commonModule } from './common/common.module';
import { UserService } from './user/user.service';
import { PrismaService } from './common/prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { ZodExceptionFilter } from './common/error.filter';

@Module({
  imports: [UserModule, commonModule],
  controllers: [],
  providers: [
    UserService,
    PrismaService,
    { provide: APP_FILTER, useClass: ZodExceptionFilter },
  ],
})
export class AppModule {}
