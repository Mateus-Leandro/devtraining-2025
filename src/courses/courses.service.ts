import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tags.entity';
import { createCourseDTO } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll() {
    return await this.courseRepository.find({
      relations: ['tags'],
    });
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }
    return course;
  }

  async create(createCourseDTO: createCourseDTO) {
    const tags = await Promise.all(
      createCourseDTO.tags.map((name) => this.preLoadTagByName(name)),
    );

    const course = this.courseRepository.create({
      ...createCourseDTO,
      tags,
    });
    return await this.courseRepository.save(course);
  }

  async update(id: number, updateCourseDTO) {
    const tags =
      updateCourseDTO.tags &&
      (await Promise.all(
        updateCourseDTO.tags.map((name) => this.preLoadTagByName(name)),
      ));

    const course = await this.courseRepository.preload({
      ...updateCourseDTO,
      id,
      tags,
    });

    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }

    return await this.courseRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }

    return this.courseRepository.remove(course);
  }

  private async preLoadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { name },
    });

    if (tag) {
      return tag;
    }

    return this.tagRepository.create({ name });
  }
}
