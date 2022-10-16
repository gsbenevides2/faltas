import chalk from "chalk";
import inquirer from "inquirer";
import { Professor } from "../../objects/Professor";
import {
  CPFValidation,
  EmailValidation,
  NomeValidation,
  TelefoneValidation,
} from "../Utils";

export async function ProfessorMenuIngressar() {
  type TextAnswers = "Nome" | "CPF" | "Email" | "Telefone";
  type Answers = Record<TextAnswers, string> & { confirm: boolean };

  const { Nome, CPF, Email, Telefone, confirm } =
    await inquirer.prompt<Answers>([
      {
        type: "input",
        name: "Nome",
        message: "Nome: ",
        validate: NomeValidation,
      },
      {
        type: "input",
        name: "CPF",
        message: "CPF: ",
        validate: CPFValidation,
      },
      {
        type: "input",
        name: "Email",
        message: "Email: ",
        validate: EmailValidation,
      },
      {
        type: "input",
        name: "Telefone",
        message: "Telefone: ",
        validate: TelefoneValidation,
      },
      {
        type: "confirm",
        name: "confirm",
        message: "Confirma o cadastro?",
      },
    ]);

  if (confirm) {
    const professor = await Professor.ingressar_professor(
      CPF,
      Nome,
      Telefone,
      Email
    );
    console.log(
      chalk.green.bold(
        "Professor cadastrado com sucesso! Seu Registro é: " +
          professor.getRegistro()
      )
    );
  } else {
    console.log("Cadastro cancelado!");
  }
}
