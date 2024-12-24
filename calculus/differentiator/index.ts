import type { Expr, VarExpr } from "@/parser/types"
import {
    ArithOperator,
    BinaryFunction,
    Constants,
    MAKE_ARITH_REC,
    UnaryFunction,
} from "@/parser/types"
import {
    MAKE_ARITH,
    MAKE_CONST,
    MAKE_EXPONENT,
    MAKE_UNARY_FUNCTION,
    MAKE_BINARY_FUNCTION,
} from "@/parser/types"

export function differentiate(expr: Expr, variable: VarExpr): Expr {
    switch (expr.type) {
        case "ConstExpr": {
            return MAKE_CONST(0)
        }

        case "VarExpr": {
            return expr.name === variable.name ? MAKE_CONST(1) : MAKE_CONST(0)
        }

        case "ExponentialExpr": {
            const { base, exponent } = expr

            if (
                base.type === "VarExpr" &&
                base.name === variable.name &&
                exponent.type === "ConstExpr"
            ) {
                if (exponent.value in Constants)
                    return MAKE_ARITH(
                        ArithOperator.Mult,
                        exponent,
                        MAKE_EXPONENT(
                            base,

                            MAKE_ARITH(
                                ArithOperator.Minus,
                                MAKE_CONST(exponent.value),
                                MAKE_CONST(1)
                            )
                        )
                    )

                return MAKE_ARITH(
                    ArithOperator.Mult,
                    exponent,
                    MAKE_EXPONENT(
                        base,
                        MAKE_CONST((exponent.value as number) - 1)
                    )
                )
            }

            if (
                base.type === "ConstExpr" &&
                exponent.type === "VarExpr" &&
                exponent.name === variable.name
            ) {
                return MAKE_ARITH(
                    ArithOperator.Mult,
                    expr,
                    MAKE_UNARY_FUNCTION(UnaryFunction.NaturalLog, base)
                )
            }

            // g(x) = a^f(x) => g'(x) =

            if (base.type === "ConstExpr") {
                return MAKE_ARITH_REC(
                    ArithOperator.Mult,
                    expr,
                    differentiate(exponent, variable),
                    MAKE_UNARY_FUNCTION(UnaryFunction.NaturalLog, base)
                )
            }

            // General case for f(x)^g(x): Use the product rule and chain rule
            // return MAKE_ARITH(
            //     ArithOperator.Mult,
            //     expr, // f(x)^g(x)
            //     MAKE_ARITH(
            //         ArithOperator.Plus,
            //         MAKE_ARITH(
            //             ArithOperator.Mult,
            //             differentiate(exponent, variable), // g'(x)
            //             MAKE_UNARY_FUNCTION(UnaryFunction.NaturalLog, base) // ln(f(x))
            //         ),
            //         MAKE_ARITH(
            //             ArithOperator.Mult,
            //             exponent, // g(x)
            //             MAKE_ARITH(
            //                 ArithOperator.Div,
            //                 differentiate(base, variable), // f'(x)
            //                 base // f(x)
            //             )
            //         )
            //     )
            // )

            return MAKE_CONST(0)
        }

        case "ArithExpr": {
            const { operator, operands } = expr
            const [left, right] = operands

            switch (operator) {
                case ArithOperator.Plus:
                    // Derivative of a + b is da + db
                    return MAKE_ARITH(
                        ArithOperator.Plus,
                        differentiate(left, variable),
                        differentiate(right, variable)
                    )

                case ArithOperator.Minus:
                    // Derivative of a - b is da - db
                    return MAKE_ARITH(
                        ArithOperator.Minus,
                        differentiate(left, variable),
                        differentiate(right, variable)
                    )

                case ArithOperator.Mult:
                    // Product rule: d/dx[u * v] = u' * v + u * v'
                    return MAKE_ARITH(
                        ArithOperator.Plus,
                        MAKE_ARITH(
                            ArithOperator.Mult,
                            differentiate(left, variable),
                            right
                        ),
                        MAKE_ARITH(
                            ArithOperator.Mult,
                            left,
                            differentiate(right, variable)
                        )
                    )

                case ArithOperator.Div:
                    // Quotient rule: d/dx[u / v] = (u' * v - u * v') / v^2
                    return MAKE_ARITH(
                        ArithOperator.Div,
                        MAKE_ARITH(
                            ArithOperator.Minus,
                            MAKE_ARITH(
                                ArithOperator.Mult,
                                differentiate(left, variable),
                                right
                            ),
                            MAKE_ARITH(
                                ArithOperator.Mult,
                                left,
                                differentiate(right, variable)
                            )
                        ),
                        MAKE_EXPONENT(right, MAKE_CONST(2))
                    )
            }
            break
        }

        case "UnaryFunctionExpr": {
            // Chain rule for unary functions: f'(g(x)) * g'(x)
            const { functionName, argument } = expr
            const innerDerivative = differentiate(argument, variable)

            switch (functionName) {
                case UnaryFunction.Sine:
                    return MAKE_ARITH(
                        ArithOperator.Mult,
                        MAKE_UNARY_FUNCTION(UnaryFunction.Cosine, argument),
                        innerDerivative
                    )

                case UnaryFunction.Cosine:
                    return MAKE_ARITH(
                        ArithOperator.Mult,
                        MAKE_CONST(-1),
                        MAKE_ARITH(
                            ArithOperator.Mult,
                            MAKE_UNARY_FUNCTION(UnaryFunction.Sine, argument),
                            innerDerivative
                        )
                    )

                case UnaryFunction.NaturalExp:
                    return MAKE_ARITH(
                        ArithOperator.Mult,
                        MAKE_UNARY_FUNCTION(UnaryFunction.NaturalExp, argument),
                        innerDerivative
                    )

                case UnaryFunction.NaturalLog:
                    return MAKE_ARITH(
                        ArithOperator.Div,
                        innerDerivative,
                        argument
                    )

                default:
                    throw new Error(
                        `Unsupported unary function: ${functionName}`
                    )
            }
        }

        case "BinaryFunctionExpr": {
            // Chain rule for binary functions: Handle f(a, b) differentiation
            const {
                functionName,
                arguments: [arg1, arg2],
            } = expr

            switch (functionName) {
                case BinaryFunction.Power:
                    // Power function: d/dx[a^b] with a and b as arguments
                    return MAKE_ARITH(
                        ArithOperator.Plus,
                        MAKE_ARITH(
                            ArithOperator.Mult,
                            MAKE_ARITH(
                                ArithOperator.Mult,
                                arg2,
                                MAKE_EXPONENT(
                                    arg1,
                                    MAKE_ARITH(
                                        ArithOperator.Minus,
                                        arg2,
                                        MAKE_CONST(1)
                                    )
                                )
                            ),
                            differentiate(arg1, variable)
                        ),
                        MAKE_ARITH(
                            ArithOperator.Mult,
                            MAKE_ARITH(
                                ArithOperator.Mult,
                                MAKE_UNARY_FUNCTION(
                                    UnaryFunction.NaturalLog,
                                    arg1
                                ),
                                MAKE_EXPONENT(arg1, arg2)
                            ),
                            differentiate(arg2, variable)
                        )
                    )

                // TODO: Implement others
                default:
                    throw new Error(
                        `Unsupported binary function: ${functionName}`
                    )
            }
        }
    }

    return {} as Expr
}
