export const TOKENS = {
  LEFT_PAREN: "(",
  RIGHT_PAREN: ")",
  LEFT_BRACE: "{",
  RIGHT_BRACE: "}",
  PLUS: "+",
  MINUS: "-",
  MULT: "*",
  DIV: "/",
  PI: "pi",
  EULER: "e",
}

export function tokenize(source: string): string[] {
  return source
    .replace(/([+\-*/^{}(),])/g, " $1 ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}
