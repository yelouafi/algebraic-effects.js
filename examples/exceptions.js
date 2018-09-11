import { start, resume, op, withHandler } from "../algebraic-effects";

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
  const x = yield katch(safeDivision(10, 0), function* (err) {
    console.error(err);
    return 0;
  });
  console.log("result", x);
}

start(main());
