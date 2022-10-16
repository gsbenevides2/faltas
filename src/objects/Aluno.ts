import { AlunoDao } from "../dao/AlunoDao";
import { Utils } from "../Utils";

export class Aluno {
  private ra: string;
  private nome: string;
  private data_nascimento: Date;
  private telefone: string;
  private email: string;
  private data_ingresso: Date;
  private data_termino: Date;

  constructor(
    ra: string,
    nome: string,
    data_nascimento: Date,
    telefone: string,
    email: string,
    data_ingresso: Date,
    data_termino: Date
  ) {
    this.ra = ra;
    this.nome = nome;
    this.data_nascimento = data_nascimento;
    this.telefone = telefone;
    this.email = email;
    this.data_ingresso = data_ingresso;
    this.data_termino = data_termino;
  }

  static async matricular_aluno(
    nome: string,
    data_nascimento: Date,
    telefone: string,
    email: string,
    data_termino: Date
  ): Promise<Aluno> {
    const ra = Utils.generateId();
    const data_ingresso = new Date();

    if (!Utils.dateHasPassed(data_nascimento)) {
      throw new Error("Data de nascimento inválida");
    }
    if (Utils.dateHasPassed(data_termino)) {
      throw new Error("Data de término inválida");
    }

    const aluno = new Aluno(
      ra,
      nome,
      data_nascimento,
      telefone,
      email,
      data_ingresso,
      data_termino
    );
    await AlunoDao.create(aluno);
    return aluno;
  }

  static async buscar_aluno(ra: string): Promise<Aluno | null> {
    return AlunoDao.get(ra);
  }

  static async listar_alunos(): Promise<Aluno[]> {
    return AlunoDao.list();
  }

  public async desmatricular_aluno(): Promise<void> {
    await AlunoDao.delete(this.ra);
  }

  public async atualizar_aluno(): Promise<void> {
    await AlunoDao.update(this);
  }

  public getRa(): string {
    return this.ra;
  }

  public getNome(): string {
    return this.nome;
  }

  public getData_nascimento(): Date {
    return this.data_nascimento;
  }

  public getTelefone(): string {
    return this.telefone;
  }

  public getEmail(): string {
    return this.email;
  }

  public getData_ingresso(): Date {
    return this.data_ingresso;
  }

  public getData_termino(): Date {
    return this.data_termino;
  }

  public setNome(nome: string): void {
    this.nome = nome;
  }

  public setData_nascimento(data_nascimento: Date): void {
    if (Utils.dateHasPassed(data_nascimento)) {
      this.data_nascimento = data_nascimento;
    } else {
      throw new Error("Data inválida");
    }
  }

  public setTelefone(telefone: string): void {
    this.telefone = telefone;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public setData_termino(data_termino: Date): void {
    if (!Utils.dateHasPassed(data_termino)) {
      this.data_termino = data_termino;
    } else {
      throw new Error("Data inválida");
    }
  }
}
