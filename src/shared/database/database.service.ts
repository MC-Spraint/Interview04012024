import { Inject, Injectable } from '@nestjs/common';
import { DatabaseConnection, DATABASE_CONNECTION } from './database.provider';
@Injectable()
export class Database {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseConnection,
  ) {}

  async query<T>(
    query: string,
    params?: (string | number | boolean | unknown)[],
  ): Promise<Array<T>> {
    const result = await this.db.query(query, params);
    return result.rows;
  }
}
