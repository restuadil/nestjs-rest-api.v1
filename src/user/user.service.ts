import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { UserResponse } from 'src/model/user.model';
import { Pagination, WebResponse } from 'src/model/web.model';

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
  async getById(id: number): Promise<User> {
    const result = await this.prismaService.user.findFirst({
      where: { id: id },
    });
    if (!result) {
      throw new HttpException('User not found', 404);
    } else {
      return result;
    }
  }
}
