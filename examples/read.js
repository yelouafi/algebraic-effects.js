import { start, resume, op, withHandler } from "../algebraic-effects";

const read = op("read");

const alwaysBob = {
  *read(_, cont) {
    const result = yield cont("Bob");
    return result;
  }
};

function* main() {
  const name = yield readName();
  console.log("Hi", name);
}

function* readName() {
  const firstName = yield read;
  const lastName = yield read;
  return `${firstName}, ${lastName}`;
}

start(withHandler(alwaysBob, main()));
