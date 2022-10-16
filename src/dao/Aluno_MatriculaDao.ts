import { Aluno } from "../objects/Aluno";
import { Disciplina_Ofertada } from "../objects/Disciplina_Ofertada";
import { Connection } from "./Connection";
import { DaoError } from "./DaoError";

export class AlunoMatriculaDao {
  static async create(disciplina: Disciplina_Ofertada, aluno: Aluno) {
    try {
      const stmt = await Connection.prepare(
        "INSERT INTO alunos_matriculas (alunos_ra, disciplinas_ofertadas_id) VALUES (?, ?)"
      );
      await Connection.bind(stmt, [aluno.getRa(), disciplina.getId()]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (e: any) {
      if (
        e.message.includes(
          "SQLITE_CONSTRAINT: UNIQUE constraint failed: alunos_matriculas.alunos_ra, alunos_matriculas.disciplinas_ofertadas_id"
        )
      ) {
        throw new DaoError("Aluno já matriculado nesta disciplina!", e);
      }
      throw new DaoError("Erro desconhecido ao matricular aluno!", e);
    }
  }

  static async list(
    disciplina_ofertada: Disciplina_Ofertada
  ): Promise<Aluno[]> {
    try {
      const stmt = await Connection.prepare(`SELECT alunos.*
      FROM alunos_matriculas
      LEFT JOIN alunos
      ON alunos_matriculas.alunos_ra  = alunos.ra
      WHERE alunos_matriculas.disciplinas_ofertadas_id = ?;`);
      await Connection.bind(stmt, [disciplina_ofertada.getId()]);
      const result = await Connection.all(stmt);
      await Connection.finalize(stmt);
      return result.map(
        (row: any) =>
          new Aluno(
            row.ra,
            row.nome,
            Connection.parseDateStringToDateObject(row.data_nascimento),
            row.telefone,
            row.email,
            Connection.parseDateStringToDateObject(row.data_ingresso),
            Connection.parseDateStringToDateObject(row.data_termino)
          )
      );
    } catch (e: any) {
      throw new DaoError("Erro deconhecido ao listar alunos matriculados!", e);
    }
  }

  static async delete(disciplina_ofertada: Disciplina_Ofertada, aluno: Aluno) {
    try {
      const stmt = await Connection.prepare(
        "DELETE FROM alunos_matriculas WHERE alunos_ra = ? AND disciplinas_ofertadas_id = ?"
      );
      await Connection.bind(stmt, [aluno.getRa(), disciplina_ofertada.getId()]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (e: any) {
      throw new DaoError("Erro desconhecido ao desmatricular aluno!", e);
    }
  }
}
