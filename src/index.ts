import chalk from "chalk";
import { MenuPrincipal } from "./cli/MenuPrincipal";
import { Connection } from "./dao/Connection";

async function start() {
  try {
    await Connection.openDb();
    await MenuPrincipal();
    await Connection.closeDb();
  } catch (e: any) {
    console.log(
      chalk.red.bold(
        "Ocorreu um excessão e por causa disso o programa será encerrado: "
      )
    );
    console.log(e.toString());
    process.exit(1);
  }
}
start();
