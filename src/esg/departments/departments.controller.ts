import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guards';
import { Roles } from 'src/common/decorators/roles.decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('departments')
@Controller('departments')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  private checkCompanyOwnership(
    userCompanyId: number,
    targetCompanyId: number,
  ) {
    if (userCompanyId !== targetCompanyId) {
      throw new ForbiddenException(
        'You can only manage departments within your company',
      );
    }
  }

  @Post(':companyId')
  @Roles('company_esg_admin', 'company_esg_subadmin')
  @ApiOperation({ summary: 'Create a department for a company' })
  @ApiForbiddenResponse({
    description: 'Forbidden: requires proper role and company ownership',
  })
  async create(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() dto: CreateDepartmentDto,
    @Request() req,
  ) {
    this.checkCompanyOwnership(req.user.companyId, companyId);
    return this.departmentsService.create(companyId, dto);
  }

  @Patch(':id')
  @Roles('company_esg_admin', 'company_esg_subadmin')
  @ApiOperation({ summary: 'Update a department' })
  @ApiForbiddenResponse({
    description: 'Forbidden: requires proper role and company ownership',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentDto,
    @Request() req,
  ) {
    // Fetch existing department to check ownership
    const department = await this.departmentsService.findById(id);
    this.checkCompanyOwnership(req.user.companyId, department.companyId);

    return this.departmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('company_esg_admin', 'company_esg_subadmin')
  @ApiOperation({ summary: 'Delete a department' })
  @ApiForbiddenResponse({
    description: 'Forbidden: requires proper role and company ownership',
  })
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const department = await this.departmentsService.findById(id);
    this.checkCompanyOwnership(req.user.companyId, department.companyId);

    return this.departmentsService.delete(id);
  }
}
