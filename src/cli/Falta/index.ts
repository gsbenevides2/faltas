import chalk from "chalk";
import clear from "clear";
import inquirer from "inquirer";
import readline from "readline-sync";

import { FaltaMenuListar } from "./Listar";
import { FaltaMenuRegistrar } from "./Registrar";
import { FaltaMenuRemover } from "./Remover";

export async function FaltaMenuInicial() {
  clear();
  console.log(chalk.blue.bold("Bem vindo ao registro de faltas!"));

  type Options =
    | "Registrar Falta"
    | "Listar Faltas"
    | "Remover Faltas"
    | "Voltar";

  const { option } = await inquirer.prompt<{ option: Options }>([
    {
      type: "list",
      name: "option",
      message: "O que deseja fazer?",
      choices: ["Registrar Falta", "Listar Faltas", "Remover Faltas", "Voltar"],
    },
  ]);

  switch (option) {
    case "Registrar Falta":
      await FaltaMenuRegistrar();
      break;
    case "Listar Faltas":
      await FaltaMenuListar();
      break;
    case "Remover Faltas":
      await FaltaMenuRemover();
      break;
  }
  if (option !== "Voltar") {
    console.log("---------------");
    readline.keyInPause(`Digite algo para continuar...`, {
      guide: false,
    });
    await FaltaMenuInicial();
  }
}
