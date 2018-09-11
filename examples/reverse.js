import { start, resume, op, withHandler } from "../algebraic-effects";

function print(msg) {
  return op("print", msg);
}

const log = {
  *print(msg, cont) {
    console.log(msg);
    const result = yield cont();
    return result;
  }
};

// a handler that prints messages on the reversed order
const reverse = {
  *print(msg, cont) {
    const result = yield cont();
    // forwards the effect upstream
    yield print(msg);
    return result;
  }
};

function* main() {
  yield withHandler(log, withHandler(reverse, printABC()));
  console.log("Bye");
}

function* printABC() {
  yield print("A");
  yield print("B");
  yield print("C");
}

start(main());
