import chalk from "chalk";
export class DaoError extends Error {
  cause?: Error;
  message: string;

  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.message = message;
  }

  toString() {
    const str = chalk.red(this.message);
    // if (process.env.NODE_ENV === "development") {
    console.error(this.cause);
    // }
    return str;
  }
}
