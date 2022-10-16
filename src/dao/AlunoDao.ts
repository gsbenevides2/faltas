import { Aluno } from "../objects/Aluno";
import { Connection } from "./Connection";
import { DaoError } from "./DaoError";

export class AlunoDao {
  static async create(aluno: Aluno) {
    try {
      const stmt = await Connection.prepare(
        "INSERT INTO alunos (ra, nome, data_nascimento, telefone, email, data_ingresso, data_termino) VALUES (?, ?, ?, ?, ?, ?, ?)"
      );
      await Connection.bind(stmt, [
        aluno.getRa(),
        aluno.getNome(),
        Connection.parseDateObjectToDateString(aluno.getData_nascimento()),
        aluno.getTelefone(),
        aluno.getEmail(),
        Connection.parseDateObjectToDateString(aluno.getData_ingresso()),
        Connection.parseDateObjectToDateString(aluno.getData_termino()),
      ]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (error: any) {
      throw new DaoError("Erro desconhecido ao criar aluno!", error);
    }
  }

  static async get(ra: string): Promise<Aluno | null> {
    try {
      const stmt = await Connection.prepare(
        "SELECT * FROM alunos WHERE ra = ?"
      );
      await Connection.bind(stmt, [ra]);
      const row = await Connection.get(stmt);
      await Connection.finalize(stmt);
      if (row) {
        return new Aluno(
          row.ra,
          row.nome,
          Connection.parseDateStringToDateObject(row.data_nascimento),
          row.telefone,
          row.email,
          Connection.parseDateStringToDateObject(row.data_ingresso),
          Connection.parseDateStringToDateObject(row.data_termino)
        );
      } else {
        return null;
      }
    } catch (error: any) {
      throw new DaoError("Erro desconhecido ao buscar aluno!", error);
    }
  }

  static async list(): Promise<Aluno[]> {
    try {
      const stmt = await Connection.prepare("SELECT * FROM alunos");
      const rows = await Connection.all(stmt);
      await Connection.finalize(stmt);
      return rows.map((row) => {
        return new Aluno(
          row.ra,
          row.nome,
          Connection.parseDateStringToDateObject(row.data_nascimento),
          row.telefone,
          row.email,
          Connection.parseDateStringToDateObject(row.data_ingresso),
          Connection.parseDateStringToDateObject(row.data_termino)
        );
      });
    } catch (e: any) {
      throw new DaoError("Erro desconhecido ao listar alunos!", e);
    }
  }

  static async update(aluno: Aluno) {
    try {
      const stmt = await Connection.prepare(
        "UPDATE alunos SET nome = ?, data_nascimento = ?, telefone = ?, email = ?,  data_termino = ? WHERE ra = ?"
      );
      await Connection.bind(stmt, [
        aluno.getNome(),
        Connection.parseDateObjectToDateString(aluno.getData_nascimento()),
        aluno.getTelefone(),
        aluno.getEmail(),
        Connection.parseDateObjectToDateString(aluno.getData_termino()),
        aluno.getRa(),
      ]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (error: any) {
      throw new DaoError("Erro desconhecido ao atualizar aluno!", error);
    }
  }

  static async delete(ra: string) {
    try {
      const stmt = await Connection.prepare("DELETE FROM alunos WHERE ra = ?");
      await Connection.bind(stmt, [ra]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (error: any) {
      throw new DaoError("Erro desconhecido ao deletar aluno!", error);
    }
  }
}
