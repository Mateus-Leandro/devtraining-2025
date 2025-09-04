import { randomUUID } from 'node:crypto';
import { CoursesService } from './courses.service';
import { createCourseDTO } from './dto/create-course.dto';

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
      findAll: jest.fn(),
      find: jest.fn().mockResolvedValue([expectOutputCourses]),
    };

    mockTagRepository = {
      create: jest.fn().mockImplementation((tag) => ({
        ...tag,
        id: id,
        created_at: created_at,
      })),
      findOne: jest.fn(),
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

    const createCourseDTO: createCourseDTO = {
      name: 'test',
      description: 'test description',
      tags: ['nestjs'],
    };

    const newCourse = await service.create(createCourseDTO);

    expect(mockCourseRepository.save).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(newCourse);
  });

  it('should list all courses', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    const courses = await service.findAll();

    expect(mockCourseRepository.find).toHaveBeenCalled();
    expect(courses).toStrictEqual([expectOutputCourses]);
  });
});
