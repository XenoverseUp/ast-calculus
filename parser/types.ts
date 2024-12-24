export type Expr =
    | ConstExpr
    | VarExpr
    | ExponentialExpr
    | ArithExpr
    | UnaryFunctionExpr
    | BinaryFunctionExpr

export interface ConstExpr {
    type: "ConstExpr"
    value: number | Constants
}

export interface VarExpr {
    type: "VarExpr"
    name: string
}

export interface ExponentialExpr {
    type: "ExponentialExpr"
    base: Expr
    exponent: Expr
}

export interface ArithExpr {
    type: "ArithExpr"
    operator: ArithOperator
    operands: [Expr, Expr]
}

export interface UnaryFunctionExpr {
    type: "UnaryFunctionExpr"
    functionName: UnaryFunction
    argument: Expr
}

export interface BinaryFunctionExpr {
    type: "BinaryFunctionExpr"
    functionName: BinaryFunction
    arguments: [Expr, Expr]
}

export enum UnaryFunction {
    Sine = "sin",
    Cosine = "cos",
    Tangent = "tan",
    Cotangent = "cot",
    Sec = "sec",
    Cosec = "csc",
    SquareRoot = "sqrt",
    NaturalLog = "ln",
    NaturalExp = "exp",
}

export enum BinaryFunction {
    Root = "root",
    Log = "log",
    Power = "pow",
}

export enum Constants {
    pi = "pi",
    e = "e",
}

export enum ArithOperator {
    Plus = "+",
    Minus = "-",
    Mult = "*",
    Div = "/",
}

export function MAKE_CONST(value: number | Constants): ConstExpr {
    return <ConstExpr>{ type: "ConstExpr", value }
}

export function MAKE_VAR(name: string): VarExpr {
    return <VarExpr>{ type: "VarExpr", name }
}

export function MAKE_ARITH(
    operator: ArithOperator,
    left: Expr,
    right: Expr
): ArithExpr {
    return <ArithExpr>{ type: "ArithExpr", operator, operands: [left, right] }
}

export function MAKE_EXPONENT(base: Expr, exponent: Expr): ExponentialExpr {
    return <ExponentialExpr>{
        type: "ExponentialExpr",
        base,
        exponent,
    }
}

export function MAKE_UNARY_FUNCTION(
    name: UnaryFunction,
    argument: Expr
): UnaryFunctionExpr {
    return <UnaryFunctionExpr>{
        type: "UnaryFunctionExpr",
        functionName: name,
        argument,
    }
}

export function MAKE_BINARY_FUNCTION(
    name: BinaryFunction,
    argumentList: [Expr, Expr]
): BinaryFunctionExpr {
    return <BinaryFunctionExpr>{
        type: "BinaryFunctionExpr",
        functionName: name,
        arguments: argumentList,
    }
}

// Utils

export function MAKE_ARITH_REC(
    operator: ArithOperator,
    ...args: Array<Expr>
): ArithExpr {
    if (args.length < 2)
        throw new Error(
            "Recursive arith maker call got argument count less than 2."
        )

    if (args.length === 2) {
        return MAKE_ARITH(operator, args[0], args[1])
    }

    return MAKE_ARITH(
        operator,
        args[0],
        MAKE_ARITH_REC(operator, ...args.slice(1))
    )
}

export function IS_EQUAL_CONST(expr: Expr, value: number | Constants): boolean {
    return expr.type === "ConstExpr" && expr.value === value
}
