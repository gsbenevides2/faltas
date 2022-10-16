import { Aluno } from "../objects/Aluno";
import { Disciplina_Ofertada } from "../objects/Disciplina_Ofertada";
import { Falta } from "../objects/Falta";
import { Connection } from "./Connection";
import { DaoError } from "./DaoError";

export class FaltaDao {
  static async create(falta: Falta) {
    try {
      const stmt = await Connection.prepare(
        "INSERT INTO faltas (data, alunos_ra, disciplinas_ofertadas_id) VALUES (?, ?, ?)"
      );
      await Connection.bind(stmt, [
        Connection.parseDateTimeObjectToDateTimeString(falta.getData()),
        falta.getAluno().getRa(),
        falta.getDisciplina_Ofertada().getId(),
      ]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (e: any) {
      throw new DaoError("Erro deconhecido ao criar falta!", e);
    }
  }
  
  static async list(
    aluno: Aluno,
    disiciplina: Disciplina_Ofertada
  ): Promise<Falta[]> {
    try {
      const stmt = await Connection.prepare(
        "SELECT * FROM faltas WHERE alunos_ra = ? AND disciplinas_ofertadas_id = ?"
      );
      await Connection.bind(stmt, [aluno.getRa(), disiciplina.getId()]);
      const rows = await Connection.all(stmt);
      await Connection.finalize(stmt);

      return rows.map(
        (row: any) =>
          new Falta(
            Connection.parseDateTimeStringToDateTimeObject(row.data),
            aluno,
            disiciplina
          )
      );
    } catch (e: any) {
      throw new DaoError("Erro desconhecido ao listar faltas!", e);
    }
  }

  static async delete(falta: Falta) {
    try {
      const stmt = await Connection.prepare(
        "DELETE FROM faltas WHERE data = ? AND alunos_ra = ? AND disciplinas_ofertadas_id = ?"
      );
      await Connection.bind(stmt, [
        Connection.parseDateTimeObjectToDateTimeString(falta.getData()),
        falta.getAluno().getRa(),
        falta.getDisciplina_Ofertada().getId(),
      ]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (e: any) {
      throw new DaoError("Erro desconhecida ao deletar falta!", e);
    }
  }
}
