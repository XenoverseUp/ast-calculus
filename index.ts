import { input, select } from "@inquirer/prompts"
import { parse } from "./parser"
import {
    ArithOperator,
    Constants,
    MAKE_ARITH_REC,
    MAKE_CONST,
    MAKE_VAR,
    type Expr,
    type VarExpr,
} from "./parser/types"
import { differentiate } from "@/calculus/differentiator"
import renderToString from "@/renderer/string-renderer"
import evaluate from "@/calculus/evaluate"

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

const variable = await getVariableInput(type)

try {
    const parsed: Expr = parse(equation)
    // console.dir(parsed, { depth: null })

    let result = type === Action.Diff ? differentiate(parsed, variable) : null
    // console.dir(result, { depth: null })

    console.log(renderToString(result!))
} catch (error) {
    console.log(error)
}

async function getVariableInput(type: Action): Promise<VarExpr> {
    const variable = await input({
        message: `Enter the ${
            type == Action.Diff ? "differentiation" : "integration"
        } variable.`,
    })

    if (!/^[a-zA-Z]+$/.test(variable)) {
        throw new Error(
            "Invalid variable name. Must be alphabetic characters only."
        )
    }

    return {
        type: "VarExpr",
        name: variable,
    }
}
