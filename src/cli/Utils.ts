import { Aluno } from "../objects/Aluno";
import { Professor } from "../objects/Professor";

export function EmailValidation(input: string) {
  if (/\S+@\S+\.\S+/.test(input) === false) {
    return "Email inválido";
  }
  return true;
}

export function DateValidation(input: string) {
  if (/\d{2}\/\d{2}\/\d{4}/.test(input) === false) {
    return "Data inválida! Formato: DD/MM/YYYY";
  }
  const [day, month] = input.split("/").map((x) => parseInt(x));
  if (month > 12 || month < 1) {
    return "Data inválida! Mês inválido";
  }
  if (day > 31 || day < 1) {
    return "Data inválida! Dia inválido";
  }
  return true;
}

export function StringDateToDateObject(input: string) {
  const [day, month, year] = input.split("/").map((x) => parseInt(x));
  return new Date(year, month - 1, day);
}

export function DateObjectToDateString(date: Date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function DataNascValidation(input: string) {
  const dtv = DateValidation(input);
  if (dtv !== true) return dtv;
  const date = StringDateToDateObject(input);
  return date.getTime() < Date.now();
}

export function DataTermValidation(input: string) {
  const dtv = DateValidation(input);
  if (dtv !== true) return dtv;
  const date = StringDateToDateObject(input);
  return date.getTime() > Date.now();
}

export function TelefoneValidation(input: string) {
  if (/\d{10,11}/.test(input) === false) {
    return "Telefone inválido! Formato: 9999999999";
  }
  return true;
}

export function NomeValidation(input: string) {
  if (input.length <= 0) return "O nome deve ter pelo menos 1 caractere";
  return true;
}

export async function RAValidation(input: string) {
  if (/[0-9]/.test(input) === false) return "O RA é totalmente numérico";

  const aluno = await Aluno.buscar_aluno(input);
  if (!aluno) return "Aluno não encontrado";
  return true;
}

export function SemestreValidation(input: string) {
  if (input === "1" || input === "2") return true;
  return "O semestre deve ser 1 ou 2";
}

export function NumberValidation(input: string) {
  if (/[0-9]/.test(input) === false) return "O valor deve ser numérico";
  if (parseInt(input) < 0) return "O número deve ser positivo";
  return true;
}

export function NumberOrNullValidation(input: string) {
  if (input === "") return true;
  return NumberValidation(input);
}

export async function ProfessorValidation(input: string) {
  if (/[0-9]/.test(input) === false) return "O registro é totalmente numérico";

  const professor = await Professor.buscar_professor(parseInt(input));
  if (!professor) return "Professor não encontrado";
  return true;
}

export async function ProfessorOrNullValidation(input: string) {
  if (input === "") return true;
  return await ProfessorValidation(input);
}

export function CPFValidation(input: string) {
  if (/[0-9]/.test(input) === false) return "O CPF é totalmente numérico";
  if (input.length !== 11) return "O CPF deve ter 11 dígitos";

  const invalids = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];

  if (invalids.includes(input)) return "CPF inválido";

  const [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11] = input
    .split("")
    .map((x) => parseInt(x));

  const dv1 =
    (d1 * 10 +
      d2 * 9 +
      d3 * 8 +
      d4 * 7 +
      d5 * 6 +
      d6 * 5 +
      d7 * 4 +
      d8 * 3 +
      d9 * 2) %
    11;
  const vd1 = dv1 < 2 ? 0 : 11 - dv1;
  if (vd1 !== d10) return "CPF inválido";

  const dv2 =
    (d1 * 11 +
      d2 * 10 +
      d3 * 9 +
      d4 * 8 +
      d5 * 7 +
      d6 * 6 +
      d7 * 5 +
      d8 * 4 +
      d9 * 3 +
      d10 * 2) %
    11;
  const vd2 = dv2 < 2 ? 0 : 11 - dv2;
  if (vd2 !== d11) return "CPF inválido";
  return true;
}
