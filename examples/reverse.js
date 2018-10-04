import { op, withHandler } from "../algebraic-effects";
import { log, rawLog, withLogGroup } from "./logger";

// a handler that prints messages on the reversed order
const reverse = {
  *log(data, cont) {
    const result = yield cont();
    // forwards the effect upstream
    yield rawLog(data);
    return result;
  }
};

function* main() {
  yield withHandler(reverse, printABC());
  yield log("Bye");
}

function* printABC() {
  yield log("A");
  yield log("B");
  yield log("C");
}

export default withLogGroup("reverse logs", main());
