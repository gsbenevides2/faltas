import { Database, verbose, Statement } from "sqlite3";
import fs from "fs";
import path from "path";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Connection {
  private static db: Database;
  private static dbPath = path.resolve(process.cwd(), "db.sqlite");

  private static verifyIfDbExists(): Promise<boolean> {
    return new Promise((resolve) => {
      fs.access(Connection.dbPath, fs.constants.F_OK, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  private static async createDbTables(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dbQuery = fs.readFileSync(
        path.resolve(process.cwd(), "db.sql"),
        "utf-8"
      );
      this.db.exec(dbQuery, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  static openDb() {
    return new Promise<void>(async (resolve, reject) => {
      const sqlite3 = verbose();
      const dbExists = await Connection.verifyIfDbExists();
      this.db = new sqlite3.Database(this.dbPath, async (err: any) => {
        if (err) {
          reject(err);
        }
        await this.enableForeignKeys();
        if (!dbExists) {
          console.log(
            "Detectamos que é a primeira vez que você está rodando o sistema. Criando banco de dados..."
          );

          await Connection.createDbTables();
          await wait(3000);
        }
        resolve();
      });

      this.db.on("trace", (sql: string) => {
        // console.log(sql);
      });
    });
  }

  static async enableForeignKeys() {
    await Connection.run(await Connection.prepare("PRAGMA foreign_keys = ON;"));
  }

  static closeDb(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.close((err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  static parseDateObjectToDateString(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  static parseDateStringToDateObject(date: string): Date {
    const [year, month, day] = date.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  static parseDateTimeObjectToDateTimeString(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  static parseDateTimeStringToDateTimeObject(date: string): Date {
    const [datePart, timePart] = date.split(" ");
    const [year, month, day] = datePart.split("-");
    const [hours, minutes, seconds] = timePart.split(":");
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    );
  }

  static prepare(sql: string): Promise<Statement> {
    return new Promise((resolve, reject) => {
      this.db.prepare(sql, function (err: Error) {
        if (err) {
          reject(err);
        }
        // Nesse contexto, o this é o statement
        resolve(this);
      });
    });
  }

  static bind(statement: Statement, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      statement.bind(params, (err: Error | null) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  static run(statement: Statement): Promise<void> {
    return new Promise((resolve, reject) => {
      statement.run((err: Error) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  static get(statement: Statement): Promise<any> {
    return new Promise((resolve, reject) => {
      statement.get((err: Error, row: any) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }

  static finalize(statement: Statement): Promise<void> {
    return new Promise((resolve, reject) => {
      statement.finalize((err: Error) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  static all(statement: Statement): Promise<any[]> {
    return new Promise((resolve, reject) => {
      statement.all((err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }
}
