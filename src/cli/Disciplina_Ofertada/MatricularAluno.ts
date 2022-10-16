import chalk from "chalk";
import inquirer from "inquirer";
import { Aluno } from "../../objects/Aluno";
import { Disciplina_Ofertada } from "../../objects/Disciplina_Ofertada";

export async function DisciplinaOfertadaMenuMatricularAluno() {
  const ofertas = await Disciplina_Ofertada.listar_ofertas();
  const alunos = await Aluno.listar_alunos();

  if (ofertas.length === 0) {
    console.log(
      chalk.red(
        "Nenhuma oferta de disciplina registrada. Por gentileza antes de matricular um aluno, abra uma oferta!"
      )
    );
  }

  if (alunos.length === 0) {
    console.log(
      chalk.red(
        "Nenhum aluno registrado. Por gentileza antes de matricular um aluno, cadastre um aluno!"
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
  const alunosChoices = alunos.map((aluno) => {
    const text = `${aluno.getNome()} - ${aluno.getRa()}`;
    return {
      name: text,
      value: text,
      aluno,
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
        const disciplina_ofertada = choicesDisciplinas.find(
          (choice) => choice.value === answers.disciplina_ofertada
        )?.oferta;
        const aluno = alunosChoices.find(
          (choice) => choice.value === answers.aluno
        )?.aluno;
        return `Tem certeza que deseja matricular o aluno ${aluno?.getNome()} na disciplina ${disciplina_ofertada
          ?.getDisciplina()
          .getNome()}?`;
      },
    },
  ]);
  
  if (!answers.confirm) {
    console.log("Operação cancelada.");
    return;
  }

  const disciplina_ofertada = choicesDisciplinas.find(
    (choice) => choice.value === answers.disciplina_ofertada
  )?.oferta;
  if (!disciplina_ofertada) return;
  const aluno = alunosChoices.find(
    (choice) => choice.value === answers.aluno
  )?.aluno;
  if (!aluno) return;

  await disciplina_ofertada.matricular_aluno(aluno);
  console.log(chalk.green("Aluno matriculado com sucesso!"));
}
