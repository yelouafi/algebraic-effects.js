import { start, resume, op, withHandler } from "../algebraic-effects";

function print(msg) {
  return op("print", msg);
}

const collect = {
  *return(x) {
    return [x, ""];
  },
  *print(msg, cont) {
    const [x, acc] = yield cont();
    return [x, msg + acc];
  }
};

function* main() {
  const [x, acc] = yield withHandler(collect, printABC());
  console.log("result", x);
  console.log("printed messages", acc);
}

function* printABC() {
  yield print("A");
  yield print("B");
  yield print("C");
  return 10;
}

start(main());
