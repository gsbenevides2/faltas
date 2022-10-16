import chalk from "chalk";
import inquirer from "inquirer";
import { Professor } from "../../objects/Professor";

export async function ProfessorMenuDemitir() {
  const professores = await Professor.listar_professores();

  if (professores.length === 0) {
    console.log("Nenhum professor cadastrado!");
    return;
  }

  const professores_choices = professores.map((professor) => {
    return {
      name: professor.getNome(),
      value: professor.getNome(),
      professor,
    };
  });

  type Answers = { professor: string; confirm: boolean };

  const answers = await inquirer.prompt<Answers>([
    {
      type: "list",
      name: "professor",
      message: "Selecione o professor:",
      choices: professores_choices,
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Deseja realmente demitir o professor?",
    },
  ]);

  if (!answers.confirm) {
    console.log("Operação cancelada!");
    return;
  }

  const professor = professores_choices.find(
    (choice) => choice.value === answers.professor
  )?.professor;

  if (!professor) return;

  await professor.demitir_professor();

  console.log(chalk.green("Professor demitido com sucesso!"));
}
