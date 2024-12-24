import {
    ArithOperator,
    IS_EQUAL_CONST,
    MAKE_ARITH,
    MAKE_CONST,
    type Expr,
} from "@/parser/types"

export default function evaluate(expr: Expr): Expr {
    switch (expr.type) {
        case "ArithExpr": {
            const left = evaluate(expr.operands[0])
            const right = evaluate(expr.operands[1])

            if (expr.operator === ArithOperator.Plus) {
                if (IS_EQUAL_CONST(left, 0)) return right
                if (IS_EQUAL_CONST(right, 0)) return left
            }

            if (expr.operator === ArithOperator.Mult) {
                if (IS_EQUAL_CONST(left, 0) || IS_EQUAL_CONST(right, 0))
                    return MAKE_CONST(0)

                if (IS_EQUAL_CONST(left, 1)) return right
                if (IS_EQUAL_CONST(right, 1)) return left
            }

            return {
                ...expr,
                operands: [left, right],
            }
        }
    }

    return expr
}
