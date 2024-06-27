import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { UserResponse } from 'src/model/user.model';
import { Pagination, WebResponse } from 'src/model/web.model';
import { UserValidation } from './user.validation';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}
  async getAllData(query: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<WebResponse<UserResponse[]>> {
    const { search, page, limit } = query;

    const where: Prisma.UserWhereInput = {};
    if (search) where.username = { contains: search, mode: 'insensitive' };
    const totalCount = await this.prismaService.user.count({ where });
    const results = await this.prismaService.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const pagination: Pagination = {
      size: limit,
      total_page: Math.ceil(totalCount / limit),
      current_page: page,
    };
    return { data: results, pagination: pagination };
  }
  async getById(id: number): Promise<UserResponse> {
    const result = await this.prismaService.user.findFirst({
      where: { id: id },
    });
    if (!result) {
      throw new HttpException('User not found', 404);
    } else {
      return {
        username: result.username,
        email: result.email,
        address: result.address,
      };
    }
  }
  async delete(id: number): Promise<UserResponse> {
    const result = await this.prismaService.user.delete({
      where: { id: id },
    });
    if (!result) {
      throw new HttpException('User not found', 404);
    } else {
      return {
        username: result.username,
        email: result.email,
        address: result.address,
      };
    }
  }
  async update(id: number, data: UserResponse) {
    const updateData: UserResponse = this.validationService.validate(
      UserValidation.UPDATE,
      data,
    );
    const existingUser = await this.prismaService.user.findFirst({
      where: { username: updateData.username },
    });
    if (existingUser) {
      throw new HttpException('Username already exists', 409);
    }
    const result = await this.prismaService.user.update({
      where: { id: id },
      data: updateData,
    });
    if (!result) {
      throw new HttpException('User not found', 404);
    } else {
      return {
        username: result.username,
        email: result.email,
        address: result.address,
      };
    }
  }
}
