import chalk from "chalk";
import inquirer from "inquirer";
import { Disciplina } from "../../objects/Disciplina";
import { NomeValidation } from "../Utils";

export async function DisciplinaMenuEditar() {
  const disciplinas = await Disciplina.listar();
  if (disciplinas.length === 0) {
    console.log(chalk.red("Não há disciplinas cadastradas!"));
    return;
  }

  const disciplinaChoices = disciplinas.map((disciplina) => {
    return {
      name: disciplina.getNome(),
      value: disciplina.getNome(),
      disciplina,
    };
  });

  type TextAnswers = Record<"disciplina" | "conteudo", string>;
  type Answers = TextAnswers & {
    confirm: boolean;
  };

  const { conteudo, ...answers } = await inquirer.prompt<Answers>([
    {
      type: "list",
      name: "disciplina",
      message: "Qual disciplina deseja editar?",
      choices: disciplinaChoices,
    },
    {
      type: "input",
      name: "conteudo",
      message: "Qual o novo conteúdo da disciplina?",
      default: (answers: Answers) => {
        const disciplina = disciplinaChoices.find(
          (disciplina) => disciplina.value === answers.disciplina
        )?.disciplina;
        if (!disciplina) return;
        return disciplina.getConteudo();
      },
      validate: NomeValidation,
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Deseja confirmar a edição da disciplina?",
      default: true,
    },
  ]);

  if (!answers.confirm) {
    console.log("Edição cancelada!");
    return;
  }

  const disciplina = disciplinaChoices.find(
    (disciplina) => disciplina.value === answers.disciplina
  )?.disciplina;
  if (!disciplina) return;

  disciplina.setConteudo(conteudo);

  await disciplina.atualizar_disciplina();
  console.log(chalk.green("Edição realizada com sucesso!"));
}
