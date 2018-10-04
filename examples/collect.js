import { op, withHandler, cps } from "../algebraic-effects";
import { log, logError, withLogGroup } from "./logger";

const collect = {
  *return(x) {
    return [x, ""];
  },
  *log(data, cont) {
    const [x, acc] = yield cont();
    return [x, data.args[0] + acc];
  }
};

function* main() {
  const [x, acc] = yield withHandler(collect, printABC());
  yield log("result ", x);
  yield log("printed messages ", acc);
}

function* printABC() {
  yield log("A");
  yield log("B");
  yield log("C");
  return 10;
}

export default withLogGroup("collect logs", main());
