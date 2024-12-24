import type { Expr } from "@/parser/types"

function renderToString(expr: Expr): string {
    switch (expr.type) {
        case "ArithExpr":
            const {
                operator,
                operands: [operand1, operand2],
            } = expr

            return `${renderToString(operand1)} ${operator} ${renderToString(
                operand2
            )}`

        case "BinaryFunctionExpr":
            const {
                functionName,
                arguments: [arg1, arg2],
            } = expr

            return `${functionName}(${renderToString(arg1)}, ${renderToString(
                arg2
            )})`

        case "ConstExpr":
            return expr.value.toString()

        case "ExponentialExpr":
            const { base, exponent } = expr

            return `${renderToString(base)}^(${renderToString(exponent)})`

        case "UnaryFunctionExpr":
            return `${expr.functionName}(${renderToString(expr.argument)})`

        case "VarExpr":
            return expr.name
    }
}

export default renderToString
