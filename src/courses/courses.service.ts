import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './courses.entity';

@Injectable()
export class CoursesService {
  private courses: Course[] = [
    {
      id: 1,
      name: 'NestJs',
      description: 'Curso sobre fundamentos do framework NestJS',
      tags: ['node.js', 'nestjs', 'javascript', 'typescript'],
    },
  ];

  findAll() {
    return this.courses;
  }

  findOne(id: number) {
    const course = this.courses.find((course) => course.id === id);
    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }
    return course;
  }

  create(createCourseDTO) {
    this.courses.push(createCourseDTO);
    return createCourseDTO;
  }

  update(id: number, updateCourseDTO) {
    const existingCourse = this.findOne(id);
    if (existingCourse) {
      const index = this.courses.findIndex((course) => course.id === id);
      if (index === -1) return;

      this.courses[index] = {
        id,
        ...updateCourseDTO,
      };
    }
  }

  delete(id: number) {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index === -1) return;

    this.courses.splice(index, 1);
  }
}
