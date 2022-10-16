import chalk from "chalk";
import inquirer from "inquirer";
import { Disciplina_Ofertada } from "../../objects/Disciplina_Ofertada";
import { Falta } from "../../objects/Falta";

export async function FaltaMenuRegistrar() {
  const disciplinas_ofertadas = await Disciplina_Ofertada.listar_ofertas();
  if (disciplinas_ofertadas.length === 0) {
    console.log(chalk.red("Não há disciplinas ofertadas cadastradas!"));
    return;
  }

  const disciplina_ofertada_choices = disciplinas_ofertadas.map((oferta) => {
    const disciplina = oferta.getDisciplina();
    const text = `${disciplina.getCodigo()} - ${disciplina.getNome()} - ${oferta.getSemestre()} Semestre - ${oferta.getAno()}`;
    return {
      name: text,
      value: text,
      oferta,
    };
  });

  const answers = await inquirer.prompt<{ disciplina_ofertada: string }>([
    {
      type: "list",
      name: "disciplina_ofertada",
      message: "Qual disciplina ofertada deseja listar as faltas?",
      choices: disciplina_ofertada_choices,
    },
  ]);

  const disciplina_ofertada = disciplina_ofertada_choices.find(
    (choice) => choice.value === answers.disciplina_ofertada
  )?.oferta;
  if (!disciplina_ofertada) return;

  const alunos = await disciplina_ofertada.getAlunos();

  if (alunos.length === 0) {
    console.log(chalk.red("Não há alunos cadastrados nessa disciplina!"));
    return;
  }

  const aluno_choices = alunos.map((aluno) => {
    const text = `${aluno.getNome()} - ${aluno.getRa()}`;
    return {
      name: text,
      value: text,
      aluno,
    };
  });

  const aluno_answers = await inquirer.prompt<{ aluno: string }>([
    {
      type: "list",
      name: "aluno",
      message: "Qual aluno deseja listar as faltas?",
      choices: aluno_choices,
    },
  ]);

  const aluno = aluno_choices.find(
    (choice) => choice.value === aluno_answers.aluno
  )?.aluno;

  if (!aluno) return;

  const falta = await Falta.registrar_falta(aluno, disciplina_ofertada);

  console.log(
    chalk.green(
      "Falta registrada com sucesso! Em " + falta.getData().toLocaleString()
    )
  );
}
