import type { Expr } from "@/parser/types"

export default function evaluate(expr: Expr): Expr {
    switch (expr.type) {
        case "ArithExpr": {
            const operand1 = evaluate(expr.operands[0])
            const operand2 = evaluate(expr.operands[1])

            return {
                ...expr,
                operands: [operand1, operand2],
            }
        }
    }

    return {} as Expr
}
