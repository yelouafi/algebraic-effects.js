import { start, resume, op, withHandler } from "../algebraic-effects";

function print(msg) {
  return op("print", msg);
}

const handler = {
  *print(msg, cont) {
    console.log(msg);
    yield cont();
  }
};

function* main() {
  yield withHandler(handler, printABC());
  console.log("Bye");
}

function* printABC() {
  yield print("A");
  yield print("B");
  yield print("C");
}
