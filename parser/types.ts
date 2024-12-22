export type Expr = ConstExpr | VarExpr | ExponentialExpr | ArithExpr

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

interface FunctionExpr {
  type: "FunctionExpr"
  functionName: Function
  argument: Expr
}

export enum Function {
  Sine = "sin",
  Cosine = "cos",
  Tangent = "tan",
  Cotangent = "cot",
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
