import chalk from "chalk";
import columnify from "columnify";
import { Disciplina } from "../../objects/Disciplina";

export async function DisciplinaMenuListar() {
  console.log(chalk.blue.bold("Listar Disciplinas"));
  const disciplinas = await Disciplina.listar();
  if (disciplinas.length === 0) {
    console.log(chalk.red("Não há disciplinas cadastradas!"));
  } else {
    const data = disciplinas.map((disciplina) => {
      return {
        Código: disciplina.getCodigo(),
        Nome: disciplina.getNome(),
      };
    });
    console.log(
      columnify(data, {
        columnSplitter: " | ",
        headingTransform: (heading) => chalk.green(heading),
      })
    );
  }
}
