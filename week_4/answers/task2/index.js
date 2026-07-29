import chalk from "chalk";
import readline from "readline";
import generateLoveScore, { getLoveMessage } from "./utils.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askName(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  const name1 = await askName("Enter first name: ");
  const name2 = await askName("Enter second name: ");

  const score = generateLoveScore();
  const message = getLoveMessage(score);

  console.log("");
  console.log(chalk.red(`${name1} + ${name2}`));
  console.log(chalk.yellow(`Love Score: ${score}%`));
  console.log(chalk.green(message));

  rl.close();
}

main();
