import { Disciplina } from "../objects/Disciplina";
import { Disciplina_Ofertada } from "../objects/Disciplina_Ofertada";
import { Professor } from "../objects/Professor";
import { Connection } from "./Connection";
import { DaoError } from "./DaoError";

export class Disciplina_OfertadaDao {
  static async create(disciplina_ofertada: Disciplina_Ofertada) {
    try {
      const stmt = await Connection.prepare(
        "INSERT INTO disciplinas_ofertadas (id, semestre, ano, sala, disciplinas_codigo, professores_registro) VALUES (?, ?, ?, ?, ?, ?)"
      );
      await Connection.bind(stmt, [
        disciplina_ofertada.getId(),
        disciplina_ofertada.getSemestre(),
        disciplina_ofertada.getAno(),
        disciplina_ofertada.getSala(),
        disciplina_ofertada.getDisciplina().getCodigo(),
        disciplina_ofertada.getProfessor()?.getRegistro(),
      ]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed")) {
        throw new DaoError("Disciplina já ofertada nesse semestre e ano!", err);
      } else {
        throw new DaoError(
          "Erro desconhecido ao criar disciplina ofertada!",
          err
        );
      }
    }
  }

  static async get(id: string): Promise<Disciplina_Ofertada | null> {
    try {
      const stmt = await Connection.prepare(
        `SELECT *, disciplinas.nome "nome_disciplina", professores.nome "nome_professor"
         FROM disciplinas_ofertadas
         LEFT JOIN disciplinas ON disciplinas.codigo = disciplinas_ofertadas.disciplinas_codigo
         LEFT JOIN professores ON professores.registro = disciplinas_ofertadas.professores_registro
         WHERE id = ?`
      );
      await Connection.bind(stmt, [id]);
      const row = await Connection.get(stmt);
      await Connection.finalize(stmt);
      if (row) {
        const disciplina = new Disciplina(
          row.disciplinas_codigo,
          row.nome_disciplina,
          row.conteudo
        );

        const professor = row.professores_registro
          ? new Professor(
              row.registro,
              row.cpf,
              row.nome_professor,
              row.telefone,
              row.email
            )
          : undefined;
        return new Disciplina_Ofertada(
          row.id,
          row.semestre,
          row.ano,
          disciplina,
          row.sala,
          professor
        );
      } else return null;
    } catch (e: any) {
      throw new DaoError("Erro desconhecido ao buscar disciplina ofertada!", e);
    }
  }

  static async list(): Promise<Disciplina_Ofertada[]> {
    try {
      const stmt = await Connection.prepare(
        `SELECT *, disciplinas.nome "nome_disciplina", professores.nome "nome_professor"
         FROM disciplinas_ofertadas 
         LEFT JOIN disciplinas 
         ON (disciplinas_ofertadas.disciplinas_codigo = disciplinas.codigo)
         LEFT JOIN professores
         ON (disciplinas_ofertadas.professores_registro = professores.registro);`
      );
      const rows = await Connection.all(stmt);
      await Connection.finalize(stmt);
      return rows.map((row) => {
        const disciplina = new Disciplina(
          row.codigo,
          row.nome_disciplina,
          row.conteudo
        );

        const professor = row.professores_registro
          ? new Professor(
              row.registro,
              row.cpf,
              row.nome_professor,
              row.telefone,
              row.email
            )
          : undefined;
        return new Disciplina_Ofertada(
          row.id,
          row.semestre,
          row.ano,
          disciplina,
          row.sala,
          professor
        );
      });
    } catch (err: any) {
      throw new DaoError(
        "Erro desconheido ao listar disciplinas ofertadas!",
        err
      );
    }
  }

  static async update(disciplina_ofertada: Disciplina_Ofertada) {
    try {
      const stmt = await Connection.prepare(
        "UPDATE disciplinas_ofertadas SET sala = ?,  professores_registro = ? WHERE id = ?"
      );
      await Connection.bind(stmt, [
        disciplina_ofertada.getSala(),
        disciplina_ofertada.getProfessor()?.getRegistro(),
        disciplina_ofertada.getId(),
      ]);
      await Connection.run(stmt);
      await Connection.finalize(stmt);
    } catch (err: any) {
      throw new DaoError(
        "Erro deconhecido ao atualizar disciplina ofertada!",
        err
      );
    }
  }
}
