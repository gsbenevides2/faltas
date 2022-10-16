import { AlunoMatriculaDao } from "../dao/Aluno_MatriculaDao";
import { Disciplina_OfertadaDao } from "../dao/Disciplina_OfertadaDao";
import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";
import { Professor } from "./Professor";

export class Disciplina_Ofertada {
  private id: string;
  private semestre: number;
  private ano: number;
  private sala?: number;
  private disciplina: Disciplina;
  private professor?: Professor;

  constructor(
    id: string,
    semestre: number,
    ano: number,
    disciplina: Disciplina,
    sala?: number,
    professor?: Professor
  ) {
    this.id = id;
    this.semestre = semestre;
    this.ano = ano;
    this.disciplina = disciplina;
    this.sala = sala;
    this.professor = professor;
  }

  public static async abrir_oferta(
    disciplina: Disciplina,
    semestre: number,
    ano: number,
    professor?: Professor,
    sala?: number
  ): Promise<Disciplina_Ofertada> {
    const id = `${disciplina.getCodigo()}${ano}${semestre}`;
    const disciplina_ofertada = new Disciplina_Ofertada(
      id,
      semestre,
      ano,
      disciplina,
      sala,
      professor
    );
    await Disciplina_OfertadaDao.create(disciplina_ofertada);
    return disciplina_ofertada;
  }

  public static async listar_ofertas(): Promise<Disciplina_Ofertada[]> {
    return await Disciplina_OfertadaDao.list();
  }

  public async matricular_aluno(aluno: Aluno) {
    await AlunoMatriculaDao.create(this, aluno);
  }

  public async desmatricular_aluno(aluno: Aluno) {
    await AlunoMatriculaDao.delete(this, aluno);
  }

  public static async buscar_oferta(
    disciplina: Disciplina,
    semestre: number,
    ano: number
  ): Promise<Disciplina_Ofertada | null> {
    const id = `${disciplina.getCodigo()}${ano}${semestre}`;
    return await Disciplina_OfertadaDao.get(id);
  }

  public async alterar_sala(sala: undefined | number) {
    this.sala = sala;
    await Disciplina_OfertadaDao.update(this);
  }

  public async alterar_professor(professor: undefined | Professor) {
    this.professor = professor;
    await Disciplina_OfertadaDao.update(this);
  }

  public getId(): string {
    return this.id;
  }

  public getSemestre(): number {
    return this.semestre;
  }

  public getAno(): number {
    return this.ano;
  }

  public getSala(): number | undefined {
    return this.sala;
  }

  public getDisciplina(): Disciplina {
    return this.disciplina;
  }

  public getProfessor(): Professor | undefined {
    return this.professor;
  }
  
  public async getAlunos(): Promise<Aluno[]> {
    return await AlunoMatriculaDao.list(this);
  }
}
