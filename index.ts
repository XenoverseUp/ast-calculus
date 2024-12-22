import { input, select } from "@inquirer/prompts"
import { parse } from "./parser"
import type { Expr } from "./parser/types"

enum Action {
  Diff,
  Int,
}

const type = await select({
  message: "Select the action.",
  choices: [
    {
      name: "Derivative",
      value: Action.Diff,
    },
    {
      name: "Integration",
      value: Action.Int,
    },
  ],
})

const equation = await input({
  message: "Enter the equation in LaTeX syntax.",
})

const parsed: Expr = parse(equation)

console.log(parsed)
