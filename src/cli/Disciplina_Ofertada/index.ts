import chalk from "chalk";
import clear from "clear";
import inquirer from "inquirer";
import readline from "readline-sync";
import { DisciplinaOfertadaMenuAbrir } from "./Abrir";
import { DisciplinaOfertadaMenuAlterarProfessor } from "./AlterarProfessor";
import { DisciplinaOfertadaMenuAlterarSala } from "./AlterarSala";
import { DisciplinaOfertadaMenuDesmatricularAluno } from "./DesmatricularAluno";
import { DisciplinaOfertadaMenuListar } from "./Listar";
import { DisciplinaOfertadaMenuListarAlunosMatriculados } from "./ListarAlunos";
import { DisciplinaOfertadaMenuMatricularAluno } from "./MatricularAluno";

export async function DisciplinaOfertadaMenuPrincipal() {
  clear();
  console.log(
    chalk.blue.bold("Bem vindo ao registro de disciplinas ofertadas")
  );

  type MenuOptions =
    | "Abrir Oferta"
    | "Listar Ofertas"
    | "Alterar Sala de Aula"
    | "Alterar Professor"
    | "Matricular um Aluno em uma Oferta"
    | "Listar Alunos Matriculados em uma Oferta"
    | "Desmatricular um Aluno de uma Oferta"
    | "Voltar";

  const { option } = await inquirer.prompt<{ option: MenuOptions }>([
    {
      type: "list",
      name: "option",
      message: "O que deseja fazer?",
      choices: [
        "Abrir Oferta",
        "Listar Ofertas",
        "Alterar Sala de Aula",
        "Alterar Professor",
        "Matricular um Aluno em uma Oferta",
        "Listar Alunos Matriculados em uma Oferta",
        "Desmatricular um Aluno de uma Oferta",
        "Voltar",
      ],
      pageSize: 8,
    },
  ]);

  switch (option) {
    case "Abrir Oferta":
      await DisciplinaOfertadaMenuAbrir();
      break;
    case "Listar Ofertas":
      await DisciplinaOfertadaMenuListar();
      break;
    case "Alterar Sala de Aula":
      await DisciplinaOfertadaMenuAlterarSala();
      break;
    case "Alterar Professor":
      await DisciplinaOfertadaMenuAlterarProfessor();
      break;
    case "Matricular um Aluno em uma Oferta":
      await DisciplinaOfertadaMenuMatricularAluno();
      break;
    case "Listar Alunos Matriculados em uma Oferta":
      await DisciplinaOfertadaMenuListarAlunosMatriculados();
      break;
    case "Desmatricular um Aluno de uma Oferta":
      await DisciplinaOfertadaMenuDesmatricularAluno();
      break;
  }

  if (option !== "Voltar") {
    console.log("---------------");
    readline.keyInPause(`Digite algo para continuar...`, {
      guide: false,
    });
    await DisciplinaOfertadaMenuPrincipal();
  }
}

/*
export async function DisciplinaOfertadaMenuPrincipal() {
  clear();
  console.log(
    chalk.blue.bold("Bem vindo ao registro de disciplinas ofertadas!")
  );
  const option = readline.keyInSelect(
    [
      "Abrir Oferta",
      "Listar Ofertas",
      "Alterar Sala",
      "Alterar Professor",
      "Matricular Aluno",
      "Listar Alunos Matriculados",
      "Desmatricular Aluno",
    ],
    "O que deseja fazer?",
    {
      cancel: "Voltar ao Menu Principal",
    }
  );
  clear();
  switch (option) {
    case 0:
      await DisciplinaOfertadaMenuAbrirOferta();
      break;
    case 1:
      await DisciplinaOfertadaMenuListarOfertas();
      break;

    case 2:
      await DisciplinaOfertadaMenuAlterarSala();
      break;
    case 3:
      await DisciplinaOfertadaMenuAlterarProfessor();
      break;
    case 4:
      await DisciplinaOfertadaMenuMatricularAluno();
      break;
    case 5:
      await DisciplinaOfertadaMenuListarAlunosMatriculados();
      break;
    case 6:
      await DisciplinaOfertadaMenuDesmatricularAluno();
      break;
  }
  if (option !== -1) {
    console.log("---------------");
    readline.keyInPause(`Digite algo para continuar...`, {
      guide: false,
    });
    await DisciplinaOfertadaMenuPrincipal();
  }
}

*/
