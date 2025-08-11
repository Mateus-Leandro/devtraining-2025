import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';
import { CreateCoursesTable1754954701771 } from 'src/migrations/1754954701771-CreateCoursesTable';
import { CreateTagsTable1754956215781 } from 'src/migrations/1754956215781-CreateTagsTable';

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [CreateCoursesTable1754954701771, CreateTagsTable1754956215781],
});
