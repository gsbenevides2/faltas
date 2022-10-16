import chalk from "chalk";
import inquirer from "inquirer";
import { Professor } from "../../objects/Professor";

export async function ProfessorMenuBuscar() {
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

  const answers = await inquirer.prompt<{ professor: string }>([
    {
      type: "list",
      name: "professor",
      message: "Selecione o professor:",
      choices: professores_choices,
    },
  ]);

  const professor = professores_choices.find(
    (choice) => choice.value === answers.professor
  )?.professor;

  if (!professor) return;

  console.log(chalk.bold("Registro: ") + professor.getRegistro());
  console.log(chalk.bold("Nome: ") + professor.getNome());
  console.log(chalk.bold("CPF: ") + professor.getCpf());
  console.log(chalk.bold("Email: ") + professor.getEmail());
  console.log(chalk.bold("Telefone: ") + professor.getTelefone());
}
