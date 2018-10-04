import { resume, op, withHandler, cps } from "../algebraic-effects";
import { log, withLogGroup } from "./logger";

function wait(millis) {
  return op("wait", millis);
}

const handler = {
  *wait(millis, cont) {
    yield parent => {
      setTimeout(() => resume(parent), millis);
    };
    return yield cont();
  }
};

function* main() {
  yield log("waiting 3 seconds...");
  yield wait(3000);
  yield log("done!");
}

export default withLogGroup("async", withHandler(handler, main()));
