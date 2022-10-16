import chalk from "chalk";
import columnify from "columnify";
import { Professor } from "../../objects/Professor";

export async function ProfessorMenuListar() {
  console.log(chalk.blue.bold("Listar Professores"));

  const professores = await Professor.listar_professores();

  if (professores.length === 0) {
    console.log("Nenhum professor cadastrado!");
    return;
  }

  const data = professores.map((professor) => {
    return {
      Registro: professor.getRegistro(),
      Nome: professor.getNome(),
      CPF: professor.getCpf(),
      Email: professor.getEmail(),
      Telefone: professor.getTelefone(),
    };
  });

  console.log(
    columnify(data, {
      columnSplitter: " | ",
      headingTransform: (a) => chalk.green(a),
    })
  );
}
