import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { UserRegister, UserResponse } from 'src/model/user.model';
import { AuthValidation } from './auth.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(request: UserRegister): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);
    const data: UserRegister = this.validationService.validate(
      AuthValidation.REGISTER,
      request,
    );
    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: { username: data.username },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already exists', 400);
    }
    const totalUserWithSameEmail = await this.prismaService.user.count({
      where: { email: data.email },
    });
    if (totalUserWithSameEmail != 0) {
      throw new HttpException('Email already exists', 400);
    }
    data.password = await bcrypt.hash(data.password, 10);
    const registerUser = await this.prismaService.user.create({
      data: data,
    });
    return registerUser;
  }
  async login(request: UserRegister): Promise<UserResponse> {
    this.logger.debug(`Login user ${JSON.stringify(request)}`);
    const data: UserRegister = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    );
    const user = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', 400);
    }
    return user;
  }
}
