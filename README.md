# Differentials Parser and Differentiator

This project implements an Abstract Syntax Tree (AST) based parser and differentiator for mathematical expressions. It takes mathematical expressions in LaTeX syntax as input, parses them into an AST, and computes their derivatives based on a specified variable.

## Features

- **Tokenization**: Converts mathematical expressions into tokens for parsing.
- **AST Construction**: Builds a structured AST from tokens.
- **Differentiation**: Supports differentiation of:
  - Arithmetic operations: `+`, `-`, `*`, `/`, `^`
  - Unary functions: `sin`, `cos`, `ln`, etc.
  - Binary functions: `pow(x, y)`, etc.
  - Constants and variables.
- **Handles General Cases**: Differentiates nested functions like `3^(x^2)` using chain and product rules.

## Requirements

- [Bun](https://bun.sh) (for JavaScript/TypeScript runtime and package management)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd differentials
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

## Usage

### Run the Application

To run the application:

```bash
bun run index.ts
```

Follow the interactive prompts to:

1. Select an action (e.g., differentiation).
2. Enter the mathematical expression in LaTeX syntax.
3. Specify the variable for differentiation.

### Example

#### Input:

```
✔ Select the action: Derivative
✔ Enter the equation in LaTeX syntax: 3^(x^2)
✔ Enter the differentiation variable: x
```

#### Output:

The AST and its derivative:

```json
{
  "type": "ArithExpr",
  "operator": "*",
  "operands": [
    {
      "type": "ExponentialExpr",
      "base": {
        "type": "ConstExpr",
        "value": 3
      },
      "exponent": {
        "type": "ArithExpr",
        "operator": "*",
        "operands": [
          {
            "type": "VarExpr",
            "name": "x"
          },
          {
            "type": "VarExpr",
            "name": "x"
          }
        ]
      }
    },
    {
      "type": "ArithExpr",
      "operator": "*",
      "operands": [
        {
          "type": "ConstExpr",
          "value": 2
        },
        {
          "type": "UnaryFunctionExpr",
          "functionName": "ln",
          "argument": {
            "type": "ConstExpr",
            "value": 3
          }
        }
      ]
    }
  ]
}
```

## File Structure

- `index.ts`: Entry point for the application.
- `parser.ts`: Contains the tokenizer and parser implementation.
- `differentiator.ts`: Contains differentiation logic for various expression types.
- `types.ts`: Defines TypeScript types for the AST nodes.

## Adding Features

To extend the parser or differentiator:

1. Update the `types.ts` file to define new AST node types.
2. Update the `parser.ts` to handle the new node types during parsing.
3. Update the `differentiator.ts` to compute derivatives for the new node types.

## Testing

To run tests (if implemented):

```bash
bun test
```

## License

This project is licensed under the MIT License. See `LICENSE` for details.
