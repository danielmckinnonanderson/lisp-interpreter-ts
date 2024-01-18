// Following Peter Norvig's blog post '(How to Write a (Lisp) Interpretter (in Python))'
// Link: https://norvig.com/lispy.html
// And Michael Nielsen's blog post 'Lisp as the Maxwell's equations of software
// Link: https://michaelnielsen.org/ddi/lisp-as-the-maxwells-equations-of-software/

type _Symbol = string;
type _Number = number;
type _Atom = _Symbol | _Number;
type _List = _Atom[];
type _Expression = _Atom | _List;
type _Environment = object;

const Tokenize = (characters: string): string[] =>
  characters
    .replaceAll("(", " ( ")
    .replaceAll(")", " ) ")
    .split(" ")
    .filter((token: string ) => token != "");

const ReadFromTokens = (tokens: string[]): _Expression => {
  if (tokens.length == 0) throw new Error("Syntax error: Unexpected EOF");
  
  const token = tokens.shift();

  if (token == "(") {
    const result: any[] = [];
    while (tokens[0] != ")") result.push(ReadFromTokens(tokens));
    tokens.shift();
    return result;
  } 
  else if (token == ")") throw new Error("Syntax error: Unexpected ')'");
  else return Atomize(token!);
};

const Atomize = (token: string): _Atom => {
  // Anything which is not a number is a symbol
  if (isNaN(token as any)) return token as _Symbol;
  
  // If token is not a symbol, try parsing it into number sub-types
  try {
    const integer = parseInt(token);
    return integer as _Number;
  } catch (err: any) {}
  
  try {
    const float = parseFloat(token);
    return float as _Number;
  } catch (err: any) {}

  throw new Error(`Could not atomize the input token '${token}'`);
};

const Parse = (code: string) => ReadFromTokens(Tokenize(code));

const Evaluate = (code: any) => { /* TODO */};


// Read lisp code from stdin
const lispCode: string = Bun.argv[2];
if (!lispCode) throw new Error("Found no Lisp code to interpret. Pass Lisp code or a path to a Lisp file to the program.");

console.log(Parse(lispCode));

