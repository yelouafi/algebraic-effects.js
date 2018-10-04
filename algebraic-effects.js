function isGenerator(x) {
  return x != null && typeof x.next === "function";
}

function isOp(x) {
  return x != null && x._IS_OP;
}

export function op(type, data) {
  return { _IS_OP: true, type, data };
}

export function resume(gen, arg) {
  return resumeGenerator(gen, arg);
}

function resumeGenerator(gen, arg, value, done) {
  if (done === undefined) ({ value, done } = gen.next(arg));

  if (done) {
    const _return = gen._return;
    if (isGenerator(_return)) {
      resumeGenerator(_return, value);
    } else if (typeof _return === "function") {
      _return(value);
    }
  } else {
    if (isGenerator(value)) {
      value._return = gen;
      resumeGenerator(value, null);
    } else if (typeof value === "function") {
      value(gen);
    } else if (isOp(value)) {
      while (true) {
        const result = performOp(value.type, value.data, gen);
        if (result !== undefined) {
          ({ value, done } = gen.next(result));
          if (!isOp(value)) {
            resumeGenerator(gen, null, value, done);
            break;
          }
        } else {
          break;
        }
      }
    } else {
      resumeGenerator(gen, value);
    }
  }
}

export function start(gen, onDone) {
  gen._return = onDone;
  resumeGenerator(gen, null);
}

export function withHandler(handler, gen) {
  function* withHandlerFrame() {
    const result = yield gen;
    // eventually handles the return value
    if (handler.return != null) {
      return yield handler.return(result);
    }
    return result;
  }

  const withHandlerGen = withHandlerFrame();
  withHandlerGen._handler = handler;
  return withHandlerGen;
}

function performOp(type, data, performGen) {
  // finds the closest handler for effect `type`
  let withHandlerGen = performGen;
  while (
    withHandlerGen._handler == null ||
    !withHandlerGen._handler.hasOwnProperty(type)
  ) {
    if (withHandlerGen._return == null) break;
    withHandlerGen = withHandlerGen._return;
  }

  if (
    withHandlerGen._handler == null ||
    !withHandlerGen._handler.hasOwnProperty(type)
  ) {
    throw new Error(`Unhandled Effect ${type}!`);
  }

  // found a handler, get the withHandler Generator
  const handlerFunc = withHandlerGen._handler[type];

  const handler = handlerFunc(data, function delimitedCont(value) {
    return currentGen => {
      withHandlerGen._return = currentGen;
      resumeGenerator(performGen, value);
    };
  });
  if (isGenerator(handler)) {
    // will return to the parent of withHandler
    handler._return = withHandlerGen._return;
    resumeGenerator(handler, null);
  } else {
    return handler;
  }
}
