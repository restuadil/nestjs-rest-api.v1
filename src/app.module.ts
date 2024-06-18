import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { commonModule } from './common/common.module';

@Module({
  imports: [UserModule, commonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
