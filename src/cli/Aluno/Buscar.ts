import chalk from "chalk";
import inquirer from "inquirer";
import { Aluno } from "../../objects/Aluno";
import { DateObjectToDateString, RAValidation } from "../Utils";

export async function AlunoMenuBuscar() {
  const { ra } = await inquirer.prompt<{ ra: string }>([
    {
      type: "input",
      name: "ra",
      message: "RA: ",
      validate: RAValidation,
    },
  ]);

  const aluno = await Aluno.buscar_aluno(ra);
  if (aluno == null) return;

  console.log(chalk.green("Aluno encontrado!"));
  console.log(`  Nome: ${aluno.getNome()}
  Data de Nascimento: ${DateObjectToDateString(aluno.getData_nascimento())}
  Telefone: ${aluno.getTelefone()}
  Email: ${aluno.getEmail()}
  Data de Ingresso: ${DateObjectToDateString(aluno.getData_ingresso())}
  Data de Termino: ${DateObjectToDateString(aluno.getData_termino())}`);
}
