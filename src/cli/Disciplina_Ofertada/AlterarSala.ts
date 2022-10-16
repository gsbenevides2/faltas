import chalk from "chalk";
import inquirer from "inquirer";
import { Disciplina_Ofertada } from "../../objects/Disciplina_Ofertada";
import { NumberOrNullValidation } from "../Utils";

export async function DisciplinaOfertadaMenuAlterarSala() {
  const disciplinas_ofertadas = await Disciplina_Ofertada.listar_ofertas();
  if (disciplinas_ofertadas.length === 0) {
    console.log(
      "Nenhuma oferta cadastrada! Por favor, cadastre uma oferta antes de alterar a sala."
    );
    return;
  }

  type Answers = Record<"disciplina_ofertada" | "sala", string>;
  const choices = disciplinas_ofertadas.map((disciplina_ofertada) => {
    const disciplina = disciplina_ofertada.getDisciplina();
    const text = `${disciplina.getCodigo()} - ${disciplina.getNome()} - ${disciplina_ofertada.getSemestre()} Semestre - ${disciplina_ofertada.getAno()}`;
    return {
      name: text,
      value: text,
      disciplina_ofertada,
    };
  });
  const answers = await inquirer.prompt<Answers>([
    {
      type: "search-list",
      name: "disciplina_ofertada",
      message: "Qual oferta deseja alterar a sala?",
      choices,
    },
    {
      type: "input",
      name: "sala",
      message: (answers: Answers) => {
        const disciplina_ofertada = choices.find(
          (choice) => choice.value === answers.disciplina_ofertada
        )?.disciplina_ofertada;
        const sala = disciplina_ofertada?.getSala();
        return sala ? `Qual a nova sala? (Atual: ${sala})` : "Qual a sala?";
      },
      validate: NumberOrNullValidation,
    },
  ]);

  const disciplina_ofertada = choices.find(
    (choice) => choice.value === answers.disciplina_ofertada
  )?.disciplina_ofertada;
  if (!disciplina_ofertada) return;

  const sala = answers.sala ? parseInt(answers.sala) : undefined;
  disciplina_ofertada.alterar_sala(sala);

  console.log(chalk.green("Sala alterada com sucesso!"));
}
