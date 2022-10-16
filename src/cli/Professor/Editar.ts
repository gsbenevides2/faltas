import chalk from "chalk";
import inquirer from "inquirer";
import { Professor } from "../../objects/Professor";
import { NomeValidation, EmailValidation, TelefoneValidation } from "../Utils";

export async function ProfessorMenuEditar() {
  const professores = await Professor.listar_professores();

  if (professores.length === 0) {
    console.log("Nenhum professor cadastrado!");
    return;
  }

  const professores_choices = professores.map((professor) => {
    const text = `${professor.getNome()} - ${professor.getRegistro()}`;
    return {
      name: text,
      value: text,
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

  type TextAnswers = "Nome" | "Email" | "Telefone";
  type Answers = Record<TextAnswers, string> & { confirm: boolean };

  const { Nome, Email, Telefone, confirm } = await inquirer.prompt<Answers>([
    {
      type: "input",
      name: "Nome",
      message: "Nome: ",
      validate: NomeValidation,
      default: professor.getNome(),
    },

    {
      type: "input",
      name: "Email",
      message: "Email: ",
      validate: EmailValidation,
      default: professor.getEmail(),
    },
    {
      type: "input",
      name: "Telefone",
      message: "Telefone: ",
      validate: TelefoneValidation,
      default: professor.getTelefone(),
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Confirma o cadastro?",
    },
  ]);

  if (confirm) {
    await professor.setNome(Nome);
    await professor.setEmail(Email);
    await professor.setTelefone(Telefone);
    await professor.atualizar_professor();
    console.log(chalk.green.bold("Professor editado com sucesso!"));
  } else {
    console.log("Cadastro cancelado!");
  }
}
