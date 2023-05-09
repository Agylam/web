import Bsqlite from 'better-sqlite3';

export class DatabaseMim {
    db: Bsqlite.Database;

    constructor(fileName: string) {
        this.db = new Bsqlite(fileName);
    }

    async get<T>(sql: string, params: string[]) {
        return new Promise<Awaited<T>>((resolve, reject) => {
            if (this.db == null) reject("DB is null");
            const result = this.db.prepare(sql).get(params) as Awaited<T>;
            resolve(result);
        })
    }

    async query(sql: string, params: string[]) {
        return new Promise<void>( (resolve, reject) => {
            if (this.db == null) reject("DB is null");
            this.db.prepare(sql).run(params);
            resolve();
        })
    }

    async all<T>(sql: string, params: string[]) {
        return new Promise<Awaited<T>[]>((resolve, reject) => {
            if (this.db == null) reject("DB is null");
            const result = this.db.prepare(sql).all(params) as Awaited<T>[];
            resolve(result);
        })
    }
}