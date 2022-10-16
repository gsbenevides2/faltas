import chalk from "chalk";
import clear from "clear";
import columnify from "columnify";
import { Aluno } from "../../objects/Aluno";
import { Utils } from "../../Utils";

export async function AlunoMenuListar() {
  clear();
  console.log(chalk.blue.bold("Listar Alunos"));
  const alunos = await Aluno.listar_alunos();

  if (alunos.length === 0) {
    console.log("Nenhum aluno encontrado!");
    return;
  }

  const data = alunos.map((aluno) => {
    return {
      RA: aluno.getRa(),
      Nome: aluno.getNome(),
      "Data de Nascimento": Utils.formatDate(aluno.getData_nascimento()),
      Telefone: aluno.getTelefone(),
      Email: aluno.getEmail(),
      "Data de Ingresso": Utils.formatDate(aluno.getData_ingresso()),
      "Data de Termino": Utils.formatDate(aluno.getData_termino()),
    };
  });

  const table = columnify(data, {
    columnSplitter: " | ",
    headingTransform: (heading) => chalk.green(heading),
  });
  console.log(table);
}
