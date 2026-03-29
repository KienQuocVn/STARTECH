import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Permissions } from '../auth/permissions.decorator';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Throttle({ strict: { ttl: 60_000, limit: 10 } })
  @ApiOperation({ summary: 'Gửi form liên hệ — giới hạn 10 lần/phút mỗi IP' })
  @ApiResponse({ status: 201, description: 'Gửi form liên hệ thành công.' })
  @ApiResponse({ status: 429, description: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  @ApiBody({ type: CreateContactDto })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.submitForm(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR', 'VIEWER')
  @Permissions('lead.read')
  @ApiOperation({ summary: 'Lay danh sach lead lien he cho admin' })
  findAll() {
    return this.contactService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @Permissions('lead.write')
  @ApiOperation({ summary: 'Cap nhat trang thai lead' })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateContactStatusDto: UpdateContactStatusDto) {
    return this.contactService.updateStatus(id, updateContactStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Permissions('lead.delete')
  @ApiOperation({ summary: 'Xoa lead lien he' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.remove(id);
  }
}
