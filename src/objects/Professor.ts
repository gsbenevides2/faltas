import { ProfessorDao } from "../dao/ProfesorDao";
import { Utils } from "../Utils";

export class Professor {
  private registro: number;
  private cpf: string;
  private nome: string;
  private telefone: string;
  private email: string;

  constructor(
    registro: number,
    cpf: string,
    nome: string,
    telefone: string,
    email: string
  ) {
    this.registro = registro;
    this.cpf = cpf;
    this.nome = nome;
    this.telefone = telefone;
    this.email = email;
  }

  public static async ingressar_professor(
    cpf: string,
    nome: string,
    telefone: string,
    email: string
  ): Promise<Professor> {
    const registro = parseInt(Utils.generateId());
    const prof = new Professor(registro, cpf, nome, telefone, email);
    await ProfessorDao.create(prof);
    return prof;
  }

  public static async listar_professores(): Promise<Professor[]> {
    const profs = await ProfessorDao.list();
    return profs;
  }

  public static async buscar_professor(
    registro: number
  ): Promise<Professor | null> {
    const prof = await ProfessorDao.get(registro);
    return prof;
  }

  public async demitir_professor(): Promise<void> {
    await ProfessorDao.delete(this.registro);
  }

  public async atualizar_professor(): Promise<void> {
    await ProfessorDao.update(this);
  }

  public getRegistro(): number {
    return this.registro;
  }

  public getCpf(): string {
    return this.cpf;
  }

  public getNome(): string {
    return this.nome;
  }

  public getTelefone(): string {
    return this.telefone;
  }

  public getEmail(): string {
    return this.email;
  }

  public setNome(nome: string): void {
    this.nome = nome;
  }

  public setTelefone(telefone: string): void {
    this.telefone = telefone;
  }

  public setEmail(email: string): void {
    this.email = email;
  }
}
