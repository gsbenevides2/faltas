import chalk from "chalk";
import inquirer from "inquirer";
import { Aluno } from "../../objects/Aluno";
import {
  DataNascValidation,
  DataTermValidation,
  StringDateToDateObject,
  EmailValidation,
  NomeValidation,
  TelefoneValidation,
} from "../Utils";

export async function AlunoMenuMatricular() {
  type Keys =
    | "nome"
    | "data_nascimento"
    | "telefone"
    | "email"
    | "data_termino"
    | "confirm";
  type Answers = Record<Keys, string>;

  const answers = await inquirer.prompt<Answers>([
    {
      type: "input",
      name: "nome",
      message: "Nome: ",
      validate: NomeValidation,
    },
    {
      type: "input",
      name: "data_nascimento",
      message: "Data de Nascimento: (DD/MM/YYYY) ",
      validate: DataNascValidation,
    },
    {
      type: "input",
      name: "telefone",
      message: "Telefone: (somente digitos) ",
      validate: TelefoneValidation,
    },
    {
      type: "input",
      name: "email",
      message: "Email: ",
      validate: EmailValidation,
    },
    {
      type: "input",
      name: "data_termino",
      message: "Data de Termino: (DD/MM/YYYY) ",
      validate: DataTermValidation,
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Confirmar Cadastro?",
      default: true,
    },
  ]);

  const { nome, telefone, email, confirm } = answers;

  const data_nascimento = StringDateToDateObject(answers.data_nascimento);
  const data_termino = StringDateToDateObject(answers.data_termino);

  if (confirm) {
    const aluno = await Aluno.matricular_aluno(
      nome,
      data_nascimento,
      telefone,
      email,
      data_termino
    );
    console.log(
      chalk.green.bold(
        `Aluno cadastrado com sucesso! Seu RA é: ${aluno.getRa()}`
      )
    );
  } else {
    console.log("Cadastro cancelado!");
  }
}
