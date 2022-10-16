import chalk from "chalk";
import inquirer from "inquirer";
import { Disciplina } from "../../objects/Disciplina";
import { NomeValidation } from "../Utils";

export async function DisciplinaMenuCadastrar() {
  type TextAnswers = Record<"nome" | "conteudo", string>;
  type Answers = TextAnswers & {
    confirm: boolean;
  };

  const { nome, conteudo, confirm } = await inquirer.prompt<Answers>([
    {
      type: "input",
      name: "nome",
      message: "Qual o nome da disciplina?",
      validate: NomeValidation,
    },
    {
      type: "input",
      name: "conteudo",
      message: "Qual o conteúdo da disciplina?",
      validate: NomeValidation,
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Deseja confirmar o cadastro da disciplina?",
      default: true,
    },
  ]);

  if (confirm) {
    const disciplina = await Disciplina.criar_disciplina(nome, conteudo);
    console.log(
      chalk.green(
        "Cadastro realizado com sucesso! O Código da disciplina é: " +
          disciplina.getCodigo()
      )
    );
  } else {
    console.log("Cadastro cancelado!");
  }
}
