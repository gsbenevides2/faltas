import chalk from "chalk";
import clear from "clear";
import inquirer from "inquirer";
import { AlunoMenuInicial } from "./Aluno";
import { DisciplinaMenuPrincipal } from "./Disciplina";
import { DisciplinaOfertadaMenuPrincipal } from "./Disciplina_Ofertada";
import { FaltaMenuInicial } from "./Falta";
import { ProfessorMenuPrincipal } from "./Professor";

export async function MenuPrincipal() {
  clear();
  console.log(
    chalk.bgMagenta.bold("Bem vindo ao sistema de gestão academica!")
  );

  type Options =
    | "Opções para Alunos (Matricular, Listar, Buscar, Editar, Desmatricular)"
    | "Opções para Professores (Ingressar, Listar, Buscar, Editar, Demitir)"
    | "Opções para Disciplinas (Cadastrar, Listar, Buscar, Editar)"
    | "Opções para Disciplinas Ofertadas (Abrir Oferta, Listar, Buscar, Editar)"
    | "Opções para Faltas (Registrar, Listar, Remover)"
    | "Sair";

  const { option } = await inquirer.prompt<{ option: Options }>([
    {
      type: "list",
      name: "option",
      message: "O que deseja fazer?",
      choices: [
        "Opções para Alunos (Matricular, Listar, Buscar, Editar, Desmatricular)",
        "Opções para Professores (Ingressar, Listar, Buscar, Editar, Demitir)",
        "Opções para Disciplinas (Cadastrar, Listar, Buscar, Editar)",
        "Opções para Disciplinas Ofertadas (Abrir Oferta, Listar, Buscar, Editar)",
        "Opções para Faltas (Registrar, Listar, Remover)",
        "Sair",
      ],
    },
  ]);

  switch (option) {
    case "Opções para Alunos (Matricular, Listar, Buscar, Editar, Desmatricular)":
      await AlunoMenuInicial();
      break;
    case "Opções para Professores (Ingressar, Listar, Buscar, Editar, Demitir)":
      await ProfessorMenuPrincipal();
      break;
    case "Opções para Disciplinas (Cadastrar, Listar, Buscar, Editar)":
      await DisciplinaMenuPrincipal();
      break;
    case "Opções para Disciplinas Ofertadas (Abrir Oferta, Listar, Buscar, Editar)":
      await DisciplinaOfertadaMenuPrincipal();
      break;
    case "Opções para Faltas (Registrar, Listar, Remover)":
      await FaltaMenuInicial();
      break;
  }

  if (option !== "Sair") {
    await MenuPrincipal();
  } else {
    clear();
    console.log(chalk.cyan.bold("Saindo... Volte sempre!"));
  }
}
