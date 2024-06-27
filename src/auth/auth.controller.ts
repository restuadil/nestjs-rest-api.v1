import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegister, UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(200)
  async register(
    @Body() request: UserRegister,
  ): Promise<WebResponse<UserResponse>> {
    const response = await this.authService.register(request);
    return {
      message: 'User registration Created successfully',
      data: {
        username: response.username,
        email: response.email,
        address: response.address,
      },
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: UserRegister,
  ): Promise<WebResponse<UserResponse>> {
    const response = await this.authService.login(request);
    return {
      message: 'User login successfully',
      data: {
        username: response.username,
        email: response.email,
        address: response.address,
      },
    };
  }
}
