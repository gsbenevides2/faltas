import chalk from "chalk";
import clear from "clear";
import inquirer from "inquirer";
import readline from "readline-sync";

import { DisciplinaMenuBuscar } from "./Buscar";
import { DisciplinaMenuCadastrar } from "./Cadastrar";
import { DisciplinaMenuEditar } from "./Editar";
import { DisciplinaMenuListar } from "./Listar";
export async function DisciplinaMenuPrincipal() {
  clear();
  console.log(chalk.blue.bold("Bem vindo ao registro de disciplinas!"));

  type Options =
    | "Cadastrar Disciplina"
    | "Listar Disciplinas"
    | "Buscar Disciplina"
    | "Editar Disciplina"
    | "Voltar";

  const { option } = await inquirer.prompt<{ option: Options }>([
    {
      type: "list",
      name: "option",
      message: "O que deseja fazer?",
      choices: [
        "Cadastrar Disciplina",
        "Listar Disciplinas",
        "Buscar Disciplina",
        "Editar Disciplina",
        "Voltar",
      ],
    },
  ]);

  switch (option) {
    case "Cadastrar Disciplina":
      await DisciplinaMenuCadastrar();
      break;
    case "Listar Disciplinas":
      await DisciplinaMenuListar();
      break;
    case "Buscar Disciplina":
      await DisciplinaMenuBuscar();
      break;
    case "Editar Disciplina":
      await DisciplinaMenuEditar();
      break;
  }
  if (option !== "Voltar") {
    console.log("---------------");
    readline.keyInPause(`Digite algo para continuar...`, {
      guide: false,
    });
    await DisciplinaMenuPrincipal();
  }
}
