import { Professor } from "../objects/Professor";
import { Connection } from "./Connection";
import { DaoError } from "./DaoError";

export class ProfessorDao {
  static async create(professor: Professor) {
    try {
      const stmt = await Connection.prepare(
        "INSERT INTO professores (registro, cpf, nome, telefone, email) VALUES (?, ?, ?, ?, ?)"
      );
      await Connection.bind(stmt, [
        professor.getRegistro(),
        professor.getCpf(),
        professor.getNome(),
        professor.getTelefone(),
        professor.getEmail(),
      ]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed: professores.cpf")) {
        throw new DaoError("Professor com mesmo CPF já cadastrado!", error);
      }
      throw new DaoError("Erro desconhecido ao criar professor!", error);
    }
  }
  
  static async get(registro: number): Promise<Professor | null> {
    try {
      const stmt = await Connection.prepare(
        "SELECT * FROM professores WHERE registro = ?"
      );
      await Connection.bind(stmt, [registro]);
      const row = await Connection.get(stmt);
      await Connection.finalize(stmt);
      if (row) {
        return new Professor(
          row.registro,
          row.cpf,
          row.nome,
          row.telefone,
          row.email
        );
      } else {
        return null;
      }
    } catch (error: any) {
      throw new DaoError("Erro desconhecido ao buscar professor!", error);
    }
  }

  static async list(): Promise<Professor[]> {
    try {
      const stmt = await Connection.prepare("SELECT * FROM professores");
      const rows = await Connection.all(stmt);
      await Connection.finalize(stmt);
      return rows.map((row) => {
        return new Professor(
          row.registro,
          row.cpf,
          row.nome,
          row.telefone,
          row.email
        );
      });
    } catch (e: any) {
      throw new DaoError("Erro desconhecido ao listar professores!", e);
    }
  }

  static async update(professor: Professor) {
    try {
      const stmt = await Connection.prepare(
        "UPDATE professores SET cpf = ?, nome = ?, telefone = ?, email = ? WHERE registro = ?"
      );
      await Connection.bind(stmt, [
        professor.getCpf(),
        professor.getNome(),
        professor.getTelefone(),
        professor.getEmail(),
        professor.getRegistro(),
      ]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (e: any) {
      throw new DaoError("Erro desconhecido ao atualizar professor!", e);
    }
  }

  static async delete(registro: number) {
    try {
      const stmt = await Connection.prepare(
        "DELETE FROM professores WHERE registro = ?"
      );
      await Connection.bind(stmt, [registro]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (e: any) {
      throw new DaoError("Erro desconhecido ao deletar professor!", e);
    }
  }
}
