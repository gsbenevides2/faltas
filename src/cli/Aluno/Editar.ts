import chalk from "chalk";
import inquirer from "inquirer";
import { Aluno } from "../../objects/Aluno";
import {
  DataTermValidation,
  DateObjectToDateString,
  EmailValidation,
  NomeValidation,
  RAValidation,
  StringDateToDateObject,
  TelefoneValidation,
} from "../Utils";

export async function AlunoMenuEditar() {
  const { ra } = await inquirer.prompt<{ ra: string }>([
    {
      type: "input",
      name: "ra",
      message: "RA: ",
      validate: RAValidation,
    },
  ]);
  const aluno = await Aluno.buscar_aluno(ra);
  if (!aluno) return;
  type Keys = "nome" | "telefone" | "email" | "data_termino" | "confirm";
  type Answers = Record<Keys, string>;

  const answers = await inquirer.prompt<Answers>([
    {
      type: "input",
      name: "nome",
      message: "Nome: ",
      validate: NomeValidation,
      default: aluno.getNome(),
    },
    {
      type: "input",
      name: "telefone",
      message: "Telefone: (somente digitos) ",
      validate: TelefoneValidation,
      default: aluno.getTelefone(),
    },
    {
      type: "input",
      name: "email",
      message: "Email: ",
      validate: EmailValidation,
      default: aluno.getEmail(),
    },
    {
      type: "input",
      name: "data_termino",
      message: "Data de Termino: (DD/MM/YYYY) ",
      validate: DataTermValidation,
      default: DateObjectToDateString(aluno.getData_termino()),
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Confirmar Cadastro?",
      default: true,
    },
  ]);

  const { nome, telefone, email, confirm } = answers;

  const data_termino = StringDateToDateObject(answers.data_termino);

  if (confirm) {
    aluno.setNome(nome);
    aluno.setTelefone(telefone);
    aluno.setEmail(email);
    aluno.setData_termino(data_termino);
    await aluno.atualizar_aluno();
    console.log(chalk.green("Aluno atualizado com sucesso!"));
  } else {
    console.log("Atualização cancelada.");
  }
}
