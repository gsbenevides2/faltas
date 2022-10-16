import chalk from "chalk";
import clear from "clear";
import inquirer from "inquirer";
import { AlunoMenuMatricular } from "./Matricular";
import readline from "readline-sync";
import { AlunoMenuListar } from "./Listar";
import { AlunoMenuDesmatricular } from "./Desmatricular";
import { AlunoMenuBuscar } from "./Buscar";
import { AlunoMenuEditar } from "./Editar";

export async function AlunoMenuInicial() {
  clear();
  console.log(chalk.blue.bold("Bem vindo ao registro de alunos!"));

  type MenuOptions =
    | "Matricular Aluno"
    | "Listar Alunos"
    | "Buscar Aluno"
    | "Desmatricular Aluno"
    | "Editar Aluno"
    | "Voltar";

  const { option } = await inquirer.prompt<{ option: MenuOptions }>([
    {
      type: "list",
      name: "option",
      message: "O que deseja fazer?",
      choices: [
        "Matricular Aluno",
        "Listar Alunos",
        "Buscar Aluno",
        "Editar Aluno",
        "Desmatricular Aluno",
        "Voltar",
      ],
    },
  ]);
  switch (option) {
    case "Matricular Aluno":
      await AlunoMenuMatricular();
      break;
    case "Listar Alunos":
      await AlunoMenuListar();
      break;
    case "Desmatricular Aluno":
      await AlunoMenuDesmatricular();
      break;
    case "Buscar Aluno":
      await AlunoMenuBuscar();
      break;
    case "Editar Aluno":
      await AlunoMenuEditar();
      break;
  }
  if (option !== "Voltar") {
    console.log("---------------");
    readline.keyInPause(`Digite algo para continuar...`, {
      guide: false,
    });
    await AlunoMenuInicial();
  }
}
