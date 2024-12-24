import { tokenize, TOKENS } from "./tokenizer"
import type {
    BinaryFunctionExpr,
    ConstExpr,
    Expr,
    UnaryFunctionExpr,
} from "./types"

import {
    ArithOperator,
    BinaryFunction,
    Constants,
    UnaryFunction,
} from "./types"

export function parse(source: string): Expr {
    const tokens = tokenize(source)

    return parseExpr(tokens)
}

function parseExpr(tokens: string[]): Expr {
    let current = 0

    function peek(): string | null {
        return current < tokens.length ? tokens[current] : null
    }

    function eat(expected?: string): string | null {
        if (expected === undefined || peek() === expected) {
            return tokens[current++]
        }
        return null
    }

    function parsePrimary(): Expr {
        const token = peek()
        if (!token) throw new Error("Unexpected end of input")

        if (!isNaN(Number(token))) {
            eat()
            return { type: "ConstExpr", value: Number(token) }
        } else if (/[a-zA-Z]/.test(token)) {
            eat()

            if (Object.values(Constants).includes(token as Constants))
                return {
                    type: "ConstExpr",
                    value: token as Constants,
                } as ConstExpr

            if (
                Object.values(BinaryFunction).includes(token as BinaryFunction)
            ) {
                if (peek() === "(") {
                    eat("(")
                    const firstArgument = parseAddition()
                    if (!eat(","))
                        throw new Error(
                            `Expected comma between the arguments of for function call: ${token}`
                        )
                    const secondArgument = parseAddition()
                    if (!eat(")"))
                        throw new Error(
                            `Expected closing parenthesis for function call: ${token}`
                        )

                    return {
                        type: "BinaryFunctionExpr",
                        functionName: token as BinaryFunction,
                        arguments: [firstArgument, secondArgument],
                    } as BinaryFunctionExpr
                }
            }

            if (Object.values(UnaryFunction).includes(token as UnaryFunction)) {
                if (peek() === "(") {
                    eat("(")
                    const argument = parseAddition()
                    if (!eat(")"))
                        throw new Error(
                            "Expected closing parenthesis for function call"
                        )

                    return {
                        type: "UnaryFunctionExpr",
                        functionName: token as UnaryFunction,
                        argument,
                    } as UnaryFunctionExpr
                }
            }

            return { type: "VarExpr", name: token }
        } else if (token === "(") {
            eat("(")
            const expr = parseAddition()
            if (!eat(")")) throw new Error("Expected closing parenthesis")
            return expr
        } else if (token === "{") {
            eat("{")
            const expr = parseAddition()
            if (!eat("}")) throw new Error("Expected closing parenthesis")
            return expr
        } else {
            throw new Error(`Unexpected token: ${token}`)
        }
    }

    function parseExponentiation(): Expr {
        let left = parsePrimary()
        while (peek() === "^") {
            eat("^")
            const right = parsePrimary()
            left = { type: "ExponentialExpr", base: left, exponent: right }
        }
        return left
    }

    function parseTerm(): Expr {
        let left = parseExponentiation()
        while (peek() === "*" || peek() === "/") {
            const operator = eat() as ArithOperator
            const right = parseExponentiation()
            left = { type: "ArithExpr", operator, operands: [left, right] }
        }
        return left
    }

    function parseAddition(): Expr {
        let left = parseTerm()
        while (peek() === "+" || peek() === "-") {
            const operator = eat() as ArithOperator
            const right = parseTerm()
            left = { type: "ArithExpr", operator, operands: [left, right] }
        }
        return left
    }

    return parseAddition()
}
