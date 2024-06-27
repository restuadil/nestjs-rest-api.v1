import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { commonModule } from './common/common.module';
import { UserService } from './user/user.service';
import { PrismaService } from './common/prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { ZodExceptionFilter } from './common/error.filter';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, commonModule, CategoryModule, AuthModule],
  controllers: [],
  providers: [
    UserService,
    PrismaService,
    { provide: APP_FILTER, useClass: ZodExceptionFilter },
  ],
})
export class AppModule {}
