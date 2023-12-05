import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

function getPackageJson(): any {
  try {
    return require(path.join(process.cwd(), 'package.json'));
  } catch (error) {
    return null;
  }
}

class Database {
  private static instance: Database;
  private db: sqlite3.Database;

  private constructor() {
    const dbPath = "./database.db";

    const packageJson = getPackageJson();

    if (!packageJson.post_data.allowDb) {
      throw new Error('Database is not supported just yet!');
    }

    if (!fs.existsSync(dbPath)) {
      this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
          console.error('Error opening database:', err);
        }
      });
    } else {
      this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error('Error opening database:', err);
        }
      });
    }
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  public getDb(): sqlite3.Database {
    return this.db;
  }

  public async statement(query: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public async createDatabase(): Promise<void> {
    try {
      await this.statement(`CREATE TABLE IF NOT EXISTS servers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        features TEXT NOT NULL,
        nsfwLevel TEXT NOT NULL,
        owner_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

    } catch (error) {
      console.error('Error creating database:', error);
      throw error; // Rethrow the error to signal that the database creation failed
    }
  }
}

export default Database;

