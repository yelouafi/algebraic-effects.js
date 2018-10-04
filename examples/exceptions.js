import { op, withHandler, cps } from "../algebraic-effects";
import { log, logError, withLogGroup } from "./logger";

// define the effect creator
function raise(err) {
  return op("raise", err);
}

function katch(computation, handler) {
  return withHandler(
    {
      *raise(err, _) {
        const alternateResult = yield handler(err);
        return alternateResult;
      }
    },
    computation
  );
}

function* safeDivision(a, b) {
  return b !== 0 ? a / b : yield raise("division by zero");
}

function* main() {
  const x = yield katch(safeDivision(10, 0), function*(err) {
    yield logError(err);
    return 0;
  });
  yield log("result " + x);
}

export default withLogGroup("exceptions", main());
