import { Connection } from "./dao/Connection";

export class Utils {
  static parseDate(date: string): Date {
    const [day, month, year] = date.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  static formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static dateHasPassed(date: Date): boolean {
    return date.getTime() < Date.now();
  }

  static generateId(): string {
    return Date.now().toString();
  }

  static isValidCpf(cpf: string): boolean {
    return cpf.length === 11;
  }

  static async getDisciplinaFromName(name: string): Promise<string> {
    const words = name.split(/[\s\-()\d]/gm).filter((word) => {
      if (word.length === 0) return false;
      if (/\d/gm.test(word)) return false;
      const fisrtLetter = word.charAt(0);
      return fisrtLetter === fisrtLetter.toUpperCase();
    });

    if (words.length > 3) {
      words.splice(3);
    }

    let acronym: string;
    if (words.length === 3) {
      acronym = words.map((word) => word[0]).join("");
    } else if (words.length === 2) {
      acronym =
        words.map((word) => word[0]).join("") + words[1][1].toUpperCase();
    } else {
      acronym = words[0].slice(0, 3).toUpperCase();
    }

    const stmt = await Connection.prepare(
      "SELECT COUNT(codigo) qtd FROM disciplinas WHERE codigo LIKE ?; "
    );

    await Connection.bind(stmt, ["%" + acronym + "%"]);
    const row = await Connection.get(stmt);
    const qtd = (row.qtd + 1).toString().padStart(2, "0");
    return acronym + qtd;
  }
}
