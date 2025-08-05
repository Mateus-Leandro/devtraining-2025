import { Injectable } from '@nestjs/common';
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
    return this.courses.find((course) => course.id === id);
  }

  create(createCourseDTO) {
    this.courses.push(createCourseDTO);
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

  remove(id: number) {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index === -1) return;

    this.courses.splice(index, 1);
  }
}
