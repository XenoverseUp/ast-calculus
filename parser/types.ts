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
}

export enum BinaryFunction {
  Root = "root",
  Log = "log",
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
