import { DisciplinaDao } from "../dao/DisciplinaDao";
import { Utils } from "../Utils";

export class Disciplina {
  private codigo: string;
  private nome: string;
  private conteudo: string;

  constructor(codigo: string, nome: string, conteudo: string) {
    this.codigo = codigo;
    this.nome = nome;
    this.conteudo = conteudo;
  }

  public static async criar_disciplina(
    nome: string,
    conteudo: string
  ): Promise<Disciplina> {
    const codigo = await Utils.getDisciplinaFromName(nome);
    const disciplina = new Disciplina(codigo, nome, conteudo);
    await DisciplinaDao.create(disciplina);
    return disciplina;
  }

  public static async buscar_disciplina(
    codigo: string
  ): Promise<Disciplina | null> {
    return DisciplinaDao.get(codigo);
  }

  public static async listar(): Promise<Disciplina[]> {
    return DisciplinaDao.list();
  }

  public async atualizar_disciplina(): Promise<void> {
    await DisciplinaDao.update(this);
  }

  public getCodigo(): string {
    return this.codigo;
  }

  public getNome(): string {
    return this.nome;
  }

  public getConteudo(): string {
    return this.conteudo;
  }

  public setConteudo(conteudo: string): void {
    this.conteudo = conteudo;
  }
}
