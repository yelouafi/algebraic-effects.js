import { start, resume, op, withHandler } from "../algebraic-effects";

const get = op("get");

function put(newState) {
  return op("put", newState);
}

const state = {
  *return(x) {
    return function*() {
      return x;
    };
  },
  *get(_, cont) {
    return function*(actualState) {
      const func = yield cont(actualState);
      const result = yield func(actualState);
      return result;
    };
  },
  *put(newState, cont) {
    return function*(_) {
      const func = yield cont();
      const result = yield func(newState);
      return result;
    };
  }
};

function* main() {
  const stateFunc = yield withHandler(state, counter());
  const result = yield stateFunc(0);
  console.log("result", result);
}

function* counter() {
  let i = yield get;
  yield put(i + 1);
  i = yield get;
  yield put(i + 1);
  i = yield get;
  return i;
}

start(main());
