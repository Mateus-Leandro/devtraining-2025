import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CreateCoursesTable1754954701771 } from 'src/migrations/1754954701771-CreateCoursesTable';
import { CreateTagsTable1754956215781 } from 'src/migrations/1754956215781-CreateTagsTable';
import { CreateCoursesTagsTable1756247056347 } from 'src/migrations/1756247056347-CreateCoursesTagsTable';
import { AddCoursesIdToCoursesTagsTable1756248136383 } from 'src/migrations/1756248136383-AddCoursesIdToCoursesTagsTable';
import { AddTagsIdToCoursesTagsTable1756248848525 } from 'src/migrations/1756248848525-AddTagsIdToCoursesTagsTable';
import { Course } from 'src/courses/entities/courses.entity';
import { Tag } from 'src/courses/entities/tags.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Course, Tag],
  synchronize: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [
    CreateCoursesTable1754954701771,
    CreateTagsTable1754956215781,
    CreateCoursesTagsTable1756247056347,
    AddCoursesIdToCoursesTagsTable1756248136383,
    AddTagsIdToCoursesTagsTable1756248848525,
  ],
});
