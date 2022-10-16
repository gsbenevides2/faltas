import chalk from "chalk";
import columnify from "columnify";
import { Disciplina_Ofertada } from "../../objects/Disciplina_Ofertada";

export async function DisciplinaOfertadaMenuListar() {
  const disciplinas_ofertadas = await Disciplina_Ofertada.listar_ofertas();
  if (disciplinas_ofertadas.length === 0) {
    console.log("Nenhuma oferta cadastrada!");
    return;
  }
  const data = disciplinas_ofertadas.map((disciplina_ofertada) => {
    const professor = disciplina_ofertada.getProfessor();
    const disciplina = disciplina_ofertada.getDisciplina();

    return {
      Disciplina: `${disciplina.getCodigo()} - ${disciplina.getNome()}`,
      Professor: professor ? professor.getNome() : "Nenhum",
      Semestre: disciplina_ofertada.getSemestre(),
      Ano: disciplina_ofertada.getAno(),
      Sala: disciplina_ofertada.getSala() || "Não informada",
    };
  });

  console.log(
    columnify(data, {
      headingTransform: (heading) => chalk.green(heading),
    })
  );
}
