import { randomUUID } from 'node:crypto';
import { CoursesService } from './courses.service';
import { createCourseDTO as updateCourseDTO } from './dto/create-course.dto';
import { NotFoundException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;
  let id: string;
  let created_at: Date;
  let expectOutputTags: any;
  let expectOutputCourses: any;
  let mockCourseRepository: any;
  let mockTagRepository: any;

  beforeEach(async () => {
    service = new CoursesService();
    id = randomUUID();
    created_at = new Date();

    expectOutputTags = [
      {
        id,
        name: 'nestjs',
        created_at,
      },
    ];

    expectOutputCourses = {
      id,
      name: 'test',
      description: 'test description',
      created_at,
      tags: expectOutputTags,
    };

    mockCourseRepository = {
      create: jest.fn().mockImplementation((course) => ({
        ...course,
      })),
      save: jest.fn().mockImplementation((course) => ({
        ...course,
        id: id,
        created_at: created_at,
      })),
      find: jest.fn().mockResolvedValue([expectOutputCourses]),
      findOne: jest
        .fn()
        .mockImplementation(({ where: { id } }) =>
          Promise.resolve(
            expectOutputCourses.id === id ? expectOutputCourses : null,
          ),
        ),
      preload: jest.fn().mockResolvedValue(expectOutputCourses),
      remove: jest.fn().mockResolvedValue(expectOutputCourses),
    };

    mockTagRepository = {
      create: jest.fn().mockImplementation((tag) => ({
        ...tag,
        id: id,
        created_at: created_at,
      })),
      findOne: jest.fn().mockResolvedValue(expectOutputTags[0]),
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a course', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;
    //@ts-expect-error defined part of methods
    service['tagRepository'] = mockTagRepository;

    const createCourseDTO: updateCourseDTO = {
      name: 'test',
      description: 'test description',
      tags: ['nestjs'],
    };

    const newCourse = await service.create(createCourseDTO);

    expect(mockCourseRepository.save).toHaveBeenCalled();
    expect(mockTagRepository.findOne).toHaveBeenCalledWith({
      where: { name: 'nestjs' },
    });
    expect(expectOutputCourses).toStrictEqual(newCourse);
  });

  it('should list all courses', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    const courses = await service.findAll();

    expect(mockCourseRepository.find).toHaveBeenCalled();
    expect(courses).toStrictEqual([expectOutputCourses]);
  });

  it('should gets a course by id', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    const course = await service.findOne(id);

    expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ['tags'],
    });
    expect(expectOutputCourses).toStrictEqual(course);
  });

  it('should throw NotFoundException if course is not found', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    mockCourseRepository.findOne.mockResolvedValueOnce(null);

    await expect(service.findOne(id)).rejects.toThrow(
      new NotFoundException(`Course ID ${id} not found`),
    );
  });

  it('should update a course', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;
    //@ts-expect-error defined part of methods
    service['tagRepository'] = mockTagRepository;

    const updateCourseDTO: updateCourseDTO = {
      name: 'test',
      description: 'test description',
      tags: ['nestjs'],
    };

    const course = await service.update(id, updateCourseDTO);

    expect(mockCourseRepository.preload).toHaveBeenCalledWith({
      ...updateCourseDTO,
      id,
      tags: expectOutputTags,
    });
    expect(mockCourseRepository.save).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(course);
  });

  it('should throw NotFoundException if course to update does not exist', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;
    //@ts-expect-error defined part of methods
    service['tagRepository'] = mockTagRepository; // Adicione o mock do tagRepository

    mockCourseRepository.preload.mockResolvedValueOnce(null);

    const updateCourseDTO: updateCourseDTO = {
      name: 'test',
      description: 'test description',
      tags: ['nestjs'],
    };

    await expect(service.update(id, updateCourseDTO)).rejects.toThrow(
      new NotFoundException(`Course ID ${id} not found`),
    );
  });

  it('should remove a course', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    await service.remove(id);

    expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
      where: { id },
    });
    expect(mockCourseRepository.remove).toHaveBeenCalledWith(
      expectOutputCourses,
    );
  });

  it('should throw NotFoundException if course to remove does not exist', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    mockCourseRepository.findOne.mockResolvedValueOnce(null);

    await expect(service.remove(id)).rejects.toThrow(
      new NotFoundException(`Course ID ${id} not found`),
    );
  });
});
