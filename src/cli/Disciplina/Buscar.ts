import chalk from "chalk";
import inquirer from "inquirer";
import { Disciplina } from "../../objects/Disciplina";

export async function DisciplinaMenuBuscar() {
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

  const answers = await inquirer.prompt<{ disciplina: string }>([
    {
      type: "list",
      name: "disciplina",
      message: "Qual disciplina deseja buscar?",
      choices: disciplinaChoices,
    },
  ]);

  const disciplina = disciplinaChoices.find(
    (disciplina) => disciplina.value === answers.disciplina
  )?.disciplina;

  if (!disciplina) return;

  console.log(
    `Código: ${disciplina.getCodigo()}\nNome: ${disciplina.getNome()}\nConteúdo: ${disciplina.getConteudo()}`
  );
}
