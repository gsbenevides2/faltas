import chalk from "chalk";
import columnify from "columnify";
import inquirer from "inquirer";

import { Disciplina_Ofertada } from "../../objects/Disciplina_Ofertada";

export async function DisciplinaOfertadaMenuListarAlunosMatriculados() {
  const ofertas = await Disciplina_Ofertada.listar_ofertas();

  if (ofertas.length === 0) {
    console.log(
      chalk.red(
        "Nenhuma oferta de disciplina registrada. Por gentileza antes de matricular um aluno, abra uma oferta!"
      )
    );
  }

  const choicesDisciplinas = ofertas.map((oferta) => {
    const disciplina = oferta.getDisciplina();
    const text = `${disciplina.getCodigo()} - ${disciplina.getNome()} - ${oferta.getSemestre()} Semestre - ${oferta.getAno()}`;
    return {
      name: text,
      value: text,
      oferta,
    };
  });

  type Answers = Record<"disciplina_ofertada", string>;

  const answers = await inquirer.prompt<Answers>([
    {
      type: "search-list",
      name: "disciplina_ofertada",
      message: "Qual oferta deseja matricular um aluno?",
      choices: choicesDisciplinas,
    },
  ]);

  const disciplina_ofertada = choicesDisciplinas.find(
    (choice) => choice.value === answers.disciplina_ofertada
  )?.oferta;
  if (!disciplina_ofertada) return;

  const alunos = await disciplina_ofertada.getAlunos();

  if (alunos.length === 0) {
    console.log("Nenhum aluno matriculado nessa disciplina.");
    return;
  }

  const dados = alunos.map((aluno) => {
    return {
      RA: aluno.getRa(),
      Nome: aluno.getNome(),
    };
  });
  console.log(
    columnify(dados, {
      headingTransform: (heading) => chalk.green(heading),
      columnSplitter: " | ",
    })
  );
}
