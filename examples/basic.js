import { op, withHandler, cps } from "../algebraic-effects";
import { log, logError, withLogGroup } from "./logger";

function* main() {
  yield printABC();
  yield log("Bye");
}

function* printABC() {
  yield log("A");
  yield log("B");
  yield log("C");
}

export default withLogGroup("basic", main());
