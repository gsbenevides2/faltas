import chalk from "chalk";
import inquirer from "inquirer";
import { Disciplina } from "../../objects/Disciplina";
import { Disciplina_Ofertada } from "../../objects/Disciplina_Ofertada";
import { Professor } from "../../objects/Professor";
import {
  NumberOrNullValidation,
  NumberValidation,
  SemestreValidation,
} from "../Utils";

inquirer.registerPrompt("search-list", require("inquirer-search-list"));

export async function DisciplinaOfertadaMenuAbrir() {
  const disciplinas = await Disciplina.listar();
  if (disciplinas.length === 0) {
    console.log(
      chalk.red(
        "Não há disciplinas cadastradas! Por gentileza, cadastre uma disciplina antes de abrir uma oferta."
      )
    );
    return;
  }

  const disciplinas_choices = disciplinas.map(
    (disciplina) => `${disciplina.getCodigo()} - ${disciplina.getNome()}`
  );

  const professores = await Professor.listar_professores();

  const professores_choices = professores.map((professor) => {
    return {
      name: `${professor.getNome()}`,
      value: `${professor.getRegistro()} - ${professor.getNome()}`,
    };
  });
  professores_choices.push({
    name: "Nenhum",
    value: "Nenhum",
  });

  type Answers = Record<
    "disciplina" | "professor" | "semestre" | "ano" | "sala",
    string
  >;

  type AnswersTwo = Answers & { confirm: boolean };

  const answers = await inquirer.prompt<AnswersTwo>([
    {
      type: "search-list",
      name: "disciplina",
      message: "Qual disciplina deseja abrir uma oferta?",
      choices: disciplinas_choices,
    },
    {
      type: "input",
      name: "semestre",
      message: "Qual o semestre da oferta?",
      validate: SemestreValidation,
    },
    {
      type: "input",
      name: "ano",
      message: "Qual o ano da oferta?",
      validate: NumberValidation,
    },
    {
      type: "input",
      name: "sala",
      message: "Qual a sala da oferta? (Você pode deixar em branco)",
      validate: NumberOrNullValidation,
    },
    {
      type: "search-list",
      name: "professor",
      message: "Qual o professor da oferta?",
      choices: professores_choices,
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Deseja confirmar a abertura da oferta?",
      default: true,
    },
  ]);

  if (!answers.confirm) {
    console.log("Oferta não aberta! Operação Cancelada!");
    return;
  }

  const disciplina = disciplinas.find(
    (disciplina) =>
      disciplina.getCodigo() === answers.disciplina.split(" - ")[0].trim()
  );
  if (disciplina === undefined) return;

  const professor = professores.find(
    (professor) =>
      professor.getRegistro() ===
      parseInt(answers.professor.split(" - ")[0].trim())
  );
  const sala = answers.sala === "" ? undefined : parseInt(answers.sala);
  const semestre = parseInt(answers.semestre);
  const ano = parseInt(answers.ano);

  await Disciplina_Ofertada.abrir_oferta(
    disciplina,
    semestre,
    ano,
    professor,
    sala
  );
  console.log(chalk.green("Oferta aberta com sucesso!"));
}

/*
async function DisciplinaOfertadaMenuAbrirOferta() {
  console.log(chalk.blue.bold("Abrir Oferta"));

  const disciplinas = await Disciplina.listar();
  if (disciplinas.length === 0) {
    console.log(
      chalk.red.bold("Impossvivel abrir oferta! Nenhuma disciplina cadastrada!")
    );
    return;
  }
  const disciplinas_nomes = disciplinas.map((disciplina) => {
    return `${disciplina.getCodigo()} - ${disciplina.getNome()}`;
  });
  const disciplina_index = readline.keyInSelect(
    disciplinas_nomes,
    "Selecione a disciplina que deseja abrir oferta:",
    {
      cancel: "Voltar ao Menu Principal",
    }
  );
  if (disciplina_index === -1) {
    console.log("---------------");
    console.log("Operação cancelada!");
    return;
  }

  const disciplina = disciplinas[disciplina_index];

  const semestre = parseInt(
    readline.question("Semestre: ", {
      limit: (input) => input === "1" || input === "2",
      limitMessage: chalk.red("O semestre deve ser 1 ou 2"),
    })
  );

  const ano = parseInt(
    readline.question("Ano: ", {
      limit: (input) => /[0-9]/.test(input) && parseInt(input) > 0,
      limitMessage: chalk.red("O ano deve ser maior que 0"),
    })
  );

  let sala: number | undefined;
  do {
    const salaDigitada = readline.question(
      "Número da Sala: (Você pode deixar em branco) "
    );
    if (salaDigitada === "") {
      sala = undefined;
      break;
    }
    if (!(/[0-9]/.test(salaDigitada) && parseInt(salaDigitada) > 0)) {
      console.log(chalk.red("O número da sala deve ser maior que 0"));
      continue;
    }

    sala = parseInt(salaDigitada);
    break;
  } while (true);

  let professor: Professor | undefined;
  do {
    const registroProfessor = readline.question(
      "Registro do Professor: (Deixe em branco caso ainda não tenha professor) "
    );
    if (registroProfessor === "") {
      professor = undefined;
      console.log("Nenhum professor foi selecionado");
      break;
    }
    if (!(/[0-9]/.test(registroProfessor) && parseInt(registroProfessor) > 0)) {
      console.log(
        chalk.red("Registro do professor deve ser um número inteiro!")
      );
      continue;
    }
    const professorEncontrado = await Professor.buscar_professor(
      parseInt(registroProfessor)
    );

    if (professorEncontrado === null) {
      console.log(chalk.red("Professor não encontrado! Tente novamente"));
      continue;
    }
    professor = professorEncontrado;
    break;
  } while (true);

  clear();

  const confirm = readline.keyInYN(
    `Confira os dados da oferta:
Disciplina: ${disciplina.getNome()}
Professor: ${professor ? professor.getNome() : "Nenhum"}
Semestre: ${semestre}
Ano: ${ano}
Sala: ${sala || "Não informada"}`
  );
  console.log("---------------");

  if (confirm) {
    const disciplina_ofertada = await Disciplina_Ofertada.abrir_oferta(
      disciplina,
      semestre,
      ano,
      professor,
      sala
    );
    console.log(
      chalk.green(
        "Oferta aberta com sucesso! Seu ID é: " + disciplina_ofertada.getId()
      )
    );
  } else {
    console.log("Operação cancelada!");
  }
}
*/
