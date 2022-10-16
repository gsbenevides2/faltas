import chalk from "chalk";
import inquirer from "inquirer";
import { Aluno } from "../../objects/Aluno";
import { DateObjectToDateString, RAValidation } from "../Utils";

export async function AlunoMenuDesmatricular() {
  console.log(chalk.blue.bold("Desmatricular Aluno"));

  const { ra } = await inquirer.prompt<{ ra: string }>([
    {
      type: "input",
      name: "ra",
      message: "RA: ",
      validate: RAValidation,
    },
  ]);

  const aluno = await Aluno.buscar_aluno(ra);
  if (!aluno) return;

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: "confirm",
      name: "confirm",
      message: `Confirmar desmatricula do aluno ${aluno.getNome()} nascido em ${DateObjectToDateString(
        aluno.getData_nascimento()
      )}?`,
      default: true,
    },
  ]);

  if (confirm) {
    await aluno.desmatricular_aluno();
    console.log(chalk.green("Aluno desmatriculado com sucesso!"));
  } else {
    console.log("Operação cancelada!");
  }
}
