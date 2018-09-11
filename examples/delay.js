import { start, resume, op, withHandler, cps } from "../algebraic-effects";

function wait(millis) {
  return op("wait", millis);
}

const handler = {
  *wait(millis, cont) {
    yield cps(parent => {
      setTimeout(() => resume(parent), millis);
    });
    return yield cont();
  }
};

function* main() {
  console.log("start main...");
  yield wait(3000);
  console.log("end main");
}

start(withHandler(handler, main()));
