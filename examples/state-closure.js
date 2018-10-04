import { op, withHandler } from "../algebraic-effects";
import { log, withLogGroup } from "./logger";

const get = op("get");

function put(newState) {
  return op("put", newState);
}

function withState(state, computation) {
  const handler = {
    *get(_, cont) {
      const result = yield cont(state);
      return result;
    },
    *put(newState, cont) {
      state = newState;
      const result = yield cont();
      return result;
    }
  };
  return withHandler(handler, computation);
}

function* main() {
  const result = yield withState(0, sub());
  yield log("result", result);
}

function* sub() {
  return yield counter();
}

function* counter() {
  let i = yield get;
  yield put(i + 1);
  i = yield get;
  yield put(i + 1);
  i = yield get;
  return i;
}

export default withLogGroup("state (closure)", main());
