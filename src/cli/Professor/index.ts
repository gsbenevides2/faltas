import readline from "readline-sync";
import chalk from "chalk";

import clear from "clear";

import inquirer from "inquirer";
import { ProfessorMenuIngressar } from "./Ingressar";
import { ProfessorMenuListar } from "./Listar";
import { ProfessorMenuBuscar } from "./Buscar";
import { ProfessorMenuEditar } from "./Editar";
import { ProfessorMenuDemitir } from "./Demitir";

export async function ProfessorMenuPrincipal() {
  clear();
  console.log(chalk.blue.bold("Bem vindo ao registro de professores!"));

  type Options =
    | "Ingressar Professor"
    | "Listar Professores"
    | "Buscar Professor"
    | "Editar Professor"
    | "Demitir Professor"
    | "Voltar";

  const { option } = await inquirer.prompt<{ option: Options }>([
    {
      type: "list",
      name: "option",
      message: "O que deseja fazer?",
      choices: [
        "Ingressar Professor",
        "Listar Professores",
        "Buscar Professor",
        "Editar Professor",
        "Demitir Professor",
        "Voltar",
      ],
    },
  ]);

  switch (option) {
    case "Ingressar Professor":
      await ProfessorMenuIngressar();
      break;
    case "Listar Professores":
      await ProfessorMenuListar();
      break;
    case "Buscar Professor":
      await ProfessorMenuBuscar();
      break;
    case "Editar Professor":
      await ProfessorMenuEditar();
      break;
    case "Demitir Professor":
      await ProfessorMenuDemitir();
      break;
  }

  if (option !== "Voltar") {
    console.log("---------------");
    readline.keyInPause("Digite algo para continuar...", {
      guide: false,
    });
    await ProfessorMenuPrincipal();
  }
}
