import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.model';
import { UserResponse } from 'src/model/user.model';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async get(
    @Query('search') search?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<WebResponse<UserResponse[]>> {
    const query: any = {
      search: search,
      page: page || 1,
      limit: limit || 20,
    };
    const result = await this.userService.getAllData(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.getById(id);
    return {
      data: result,
    };
  }
}
