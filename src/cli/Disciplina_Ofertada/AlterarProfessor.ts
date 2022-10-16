import chalk from "chalk";
import inquirer from "inquirer";
import { Disciplina_Ofertada } from "../../objects/Disciplina_Ofertada";
import { Professor } from "../../objects/Professor";

export async function DisciplinaOfertadaMenuAlterarProfessor() {
  const disciplinas_ofertadas = await Disciplina_Ofertada.listar_ofertas();
  if (disciplinas_ofertadas.length === 0) {
    console.log(
      "Nenhuma oferta cadastrada! Por favor, cadastre uma oferta antes de alterar a sala."
    );
    return;
  }

  const professores = await Professor.listar_professores();
  if (professores.length === 0) {
    console.log(
      "Nenhum professor cadastrado! Por favor, cadastre um professor antes de alterar a oferta."
    );
    return;
  }

  type Answers = Record<"disciplina_ofertada" | "professor", string>;

  const choicesDisciplinas = disciplinas_ofertadas.map(
    (disciplina_ofertada) => {
      const disciplina = disciplina_ofertada.getDisciplina();
      const text = `${disciplina.getCodigo()} - ${disciplina.getNome()} - ${disciplina_ofertada.getSemestre()} Semestre - ${disciplina_ofertada.getAno()}`;
      return {
        name: text,
        value: text,
        disciplina_ofertada,
      };
    }
  );

  type ChoicesProfessores = {
    name: string;
    value: string;
    professor: Professor | undefined;
  }[];

  const choicesProfessores: ChoicesProfessores = professores.map(
    (professor) => {
      const text = `${professor.getNome()}`;
      return {
        name: text,
        value: text,
        professor,
      };
    }
  );

  choicesProfessores.push({
    name: "Nenhum",
    value: "Nenhum",
    professor: undefined,
  });

  const answers = await inquirer.prompt<Answers>([
    {
      type: "search-list",
      name: "disciplina_ofertada",
      message: "Qual oferta deseja alterar a sala?",
      choices: choicesDisciplinas,
    },
    {
      type: "search-list",
      name: "professor",
      message: (answers: Answers) => {
        const disciplina_ofertada = choicesDisciplinas.find(
          (choice) => choice.value === answers.disciplina_ofertada
        )?.disciplina_ofertada;
        const professor = disciplina_ofertada?.getProfessor();
        return professor
          ? `Qual o novo professor? (Atual: ${professor.getNome()})`
          : "Qual o professor?";
      },
      choices: choicesProfessores,
    },
  ]);
  const disciplina_ofertada = choicesDisciplinas.find(
    (choice) => choice.value === answers.disciplina_ofertada
  )?.disciplina_ofertada;
  if (!disciplina_ofertada) return;

  const professor = choicesProfessores.find(
    (choice) => choice.value === answers.professor
  )?.professor;

  await disciplina_ofertada.alterar_professor(professor);

  console.log(chalk.green("Professor alterado com sucesso!"));
}
