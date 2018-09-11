function isGenerator(x) {
  return x != null && typeof x.next === "function";
}

function isHandler(x) {
  return x != null && x.__ISHANDLER === true;
}

function isOp(x) {
  return x != null && x.__ISOP === true;
}

function isCps(x) {
  return x != null && x.__ISCPS === true;
}

export function op(type, data) {
  return { __ISOP: true, type, data };
}

export function withHandler(handler, computation) {
  const handlerComp = { __ISHANDLER: true, handler, computation };
  computation._return = handlerComp;
  return handlerComp;
}

export function cps(func) {
  return { __ISCPS: true, func };
}

export function start(computation) {
  if (isGenerator(computation)) {
    resumeGenerator(computation, null);
  } else if (isHandler(computation)) {
    start(computation.computation);
  } else if (isOp(computation)) {
    startOp(computation);
  } else if (isCps(computation)) {
    computation.func(computation._return);
  }
}

export function resume(computation, result) {
  if (isGenerator(computation)) {
    resumeGenerator(computation, result);
  } else if (isHandler(computation)) {
    resumeHandler(computation, result);
  } else if (isOp(computation)) {
    resume(computation._return, result);
  } else if (typeof computation === "function") {
    computation(result);
  }
}

function resumeHandler({ handler, _return }, result) {
  if (handler.return != null) {
    const returnComp = handler.return(result);
    returnComp._return = _return;
    start(returnComp);
  } else {
    resume(_return, result);
  }
}

function resumeGenerator(gen, arg) {
  const { done, value } = gen.next(arg);
  if (done) {
    resume(gen._return, value);
  } else {
    value._return = gen;
    start(value);
  }
}

function startOp(op) {
  const startComp = op._return;
  let currentComp = startComp;
  let fh = isHandler(currentComp) ? startComp.handler[op.type] : null;
  while (fh == null) {
    currentComp = currentComp._return;
    if (currentComp == null) break;
    fh = isHandler(currentComp) ? currentComp.handler[op.type] : null;
  }
  if (!fh) throw new Error("Unhandled effect " + op.type);

  const handlerReturn = currentComp._return;
  currentComp._return = null;

  const handlerComp = fh(op.data, function resumeCont(value) {
    return cps(parentComp => {
      if (parentComp) currentComp._return = parentComp;
      resume(startComp, value);
    });
  });
  if (currentComp._return === null) {
    currentComp._return = handlerComp;
  }
  handlerComp._return = handlerReturn;
  start(handlerComp);
}
