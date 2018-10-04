import { op, withHandler } from "../algebraic-effects";
import { log, withLogGroup } from "./logger";

const read = op("read");

const alwaysBob = {
  *read(_, cont) {
    const result = yield cont("Bob");
    return result;
  }
};

function* main() {
  const name = yield readName();
  yield log("Hi " + name);
}

function* readName() {
  const firstName = yield read;
  const lastName = yield read;
  return `${firstName}, ${lastName}`;
}

export default withLogGroup("read", withHandler(alwaysBob, main()));
