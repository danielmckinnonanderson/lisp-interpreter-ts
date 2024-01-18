// Following Peter Norvig's blog post '(How to Write a (Lisp) Interpretter (in Python))'
// Link: https://norvig.com/lispy.html
// And Michael Nielsen's blog post 'Lisp as the Maxwell's equations of software
// Link: https://michaelnielsen.org/ddi/lisp-as-the-maxwells-equations-of-software/

const Tokenize = (characters: string): string[] =>
  characters
    .replaceAll("(", " ( ")
    .replaceAll(")", " ) ")
    .split(" ")
    .filter(token => token != "");

const ReadFromTokens = (tokens: string[]): Expression => {
  if (tokens.length == 0) throw new Error("Syntax error: Unexpected EOF");
  
  const token = tokens.shift();

  if (token == "(") {
    const result = [];
    while (tokens[0] != ")") result.push(ReadFromTokens(tokens));
    tokens.shift();
    return result;
  } 
  else if (token == ")") throw new Error("Syntax error: Unexpected ')'");
  else return Atomize(token);
};

const Atomize = (token: string): Atom => {
  // Anything which is not a number is a symbol
  if (isNaN(token)) return token as Symbol;
  
  // If token is not a symbol, try parsing it into number sub-types
  try {
    const integer = parseInt(token);
    return integer as Number;
  } catch (err: any) {}
  
  try {
    const float = parseFloat(token);
    return float as Number;
  } catch (err: any) {}

  throw new Error(`Could not atomize the input token '${token}'`);
};

const Parse = (code: string) => ReadFromTokens(Tokenize(code));

const Evaluate = (code: any) => {};

type Symbol = string;
type Number = number;
type Atom = Symbol | Number;
type List = Array;
type Expression = Atom | List;
type Environment = object;


const lispCode: string = "(begin (define r 10) (* pi (* r r)))";

console.log(Parse(lispCode));

