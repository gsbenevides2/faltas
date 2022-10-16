import { FaltaDao } from "../dao/FaltaDao";
import { Aluno } from "./Aluno";
import { Disciplina_Ofertada } from "./Disciplina_Ofertada";
export class Falta {
  private data: Date;
  private aluno: Aluno;
  private disciplina_ofertada: Disciplina_Ofertada;

  constructor(
    data: Date,
    aluno: Aluno,
    disciplina_ofertada: Disciplina_Ofertada
  ) {
    this.data = data;
    this.aluno = aluno;
    this.disciplina_ofertada = disciplina_ofertada;
  }

  public static async registrar_falta(
    aluno: Aluno,
    disciplina_ofertada: Disciplina_Ofertada
  ): Promise<Falta> {
    const falta = new Falta(new Date(), aluno, disciplina_ofertada);
    await FaltaDao.create(falta);
    return falta;
  }

  public static async listar_faltas(
    aluno: Aluno,
    disciplina: Disciplina_Ofertada
  ): Promise<Falta[]> {
    return await FaltaDao.list(aluno, disciplina);
  }

  public getData(): Date {
    return this.data;
  }

  public getAluno(): Aluno {
    return this.aluno;
  }

  public getDisciplina_Ofertada(): Disciplina_Ofertada {
    return this.disciplina_ofertada;
  }

  public async remover_falta() {
    await FaltaDao.delete(this);
  }
}
