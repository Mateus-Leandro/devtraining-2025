import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { createCourseDTO } from './dto/create-course.dto';
import { updateCourseDTO } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.courseService.findOne(id);
  }

  @Post()
  create(@Body() createCourseDTO: createCourseDTO) {
    return this.courseService.create(createCourseDTO);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateCourseDTO: updateCourseDTO) {
    return this.courseService.update(id, updateCourseDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id') id: number) {
    this.courseService.delete(id);
  }
}
