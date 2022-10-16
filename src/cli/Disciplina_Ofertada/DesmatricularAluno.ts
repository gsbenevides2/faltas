import chalk from "chalk";
import inquirer from "inquirer";
import { Disciplina_Ofertada } from "../../objects/Disciplina_Ofertada";

export async function DisciplinaOfertadaMenuDesmatricularAluno() {
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


  type TextAnswers = Record<"disciplina_ofertada" | "aluno", string>;
  type Answers = TextAnswers & {
    confirm: boolean;
  };
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
    console.log(chalk.red("Nenhum aluno matriculado nessa disciplina!"));
    return;
  }

  const alunosChoices = alunos.map((aluno) => {
    const text = `${aluno.getNome()} - ${aluno.getRa()}`;
    return {
      name: text,
      value: text,
      aluno,
    };
  });
  const answers2 = await inquirer.prompt<Answers>([
    {
      type: "search-list",
      name: "aluno",
      message: "Qual aluno deseja matricular?",
      choices: alunosChoices,
    },
    {
      type: "confirm",
      name: "confirm",
      message: (answers: TextAnswers) => {
        const aluno = alunosChoices.find(
          (choice) => choice.value === answers.aluno
        )?.aluno;
        return `Tem certeza que deseja matricular o aluno ${aluno?.getNome()} na disciplina ${disciplina_ofertada
          ?.getDisciplina()
          .getNome()}?`;
      },
    },
  ]);

  if (!answers2.confirm) {
    console.log("Operação cancelada.");
    return;
  }

  const aluno = alunosChoices.find(
    (choice) => choice.value === answers2.aluno
  )?.aluno;
  if (!aluno) return;

  await disciplina_ofertada.desmatricular_aluno(aluno);
  console.log(chalk.green("Aluno desmatriculado com sucesso!"));
}
