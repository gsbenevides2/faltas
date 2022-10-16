import { Disciplina } from "../objects/Disciplina";
import { Connection } from "./Connection";
import { DaoError } from "./DaoError";

export class DisciplinaDao {
  static async create(disciplina: Disciplina) {
    try {
      const stmt = await Connection.prepare(
        "INSERT INTO disciplinas (codigo, nome, conteudo) VALUES (?, ?, ?)"
      );
      await Connection.bind(stmt, [
        disciplina.getCodigo(),
        disciplina.getNome(),
        disciplina.getConteudo(),
      ]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed")) {
        throw new DaoError("Disciplina já cadastrada", err);
      } else {
        throw new DaoError("Erro desconhecido ao criar disciplina!", err);
      }
    }
  }

  static async get(codigo: string): Promise<Disciplina | null> {
    try {
      const stmt = await Connection.prepare(
        "SELECT * FROM disciplinas WHERE codigo = ?"
      );
      await Connection.bind(stmt, [codigo]);
      const row = await Connection.get(stmt);
      await Connection.finalize(stmt);
      if (row) {
        return new Disciplina(row.codigo, row.nome, row.conteudo);
      } else {
        return null;
      }
    } catch (err: any) {
      throw new DaoError("Erro desconhecido ao buscar disciplina!", err);
    }
  }

  static async list(): Promise<Disciplina[]> {
    try {
      const stmt = await Connection.prepare("SELECT * FROM disciplinas");
      const rows = await Connection.all(stmt);
      await Connection.finalize(stmt);
      return rows.map(
        (row) => new Disciplina(row.codigo, row.nome, row.conteudo)
      );
    } catch (err: any) {
      throw new DaoError("Erro desconhecido ao listar disciplinas!", err);
    }
  }

  static async update(disciplina: Disciplina) {
    try {
      const stmt = await Connection.prepare(
        "UPDATE disciplinas SET conteudo = ? WHERE codigo = ?"
      );
      await Connection.bind(stmt, [
        disciplina.getConteudo(),
        disciplina.getCodigo(),
      ]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (err: any) {
      throw new DaoError("Erro desconhecido ao atualizar disciplina!", err);
    }
  }

  static async delete(codigo: string) {
    try {
      const stmt = await Connection.prepare(
        "DELETE FROM disciplinas WHERE codigo = ?"
      );
      await Connection.bind(stmt, [codigo]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (err: any) {
      throw new DaoError("Erro desconhecido ao deletar disciplina!", err);
    }
  }
}
