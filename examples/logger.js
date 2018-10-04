import { withHandler, op } from "../algebraic-effects";

export function rawLog(data) {
  return op("log", data);
}

export function log(...args) {
  return op("log", { args, method: "log" });
}

export function logError(...args) {
  return op("log", { args, method: "error" });
}

export const commitLogs = op("commitLogs");

export const grouppedLogs = () => {
  let logs = {};

  function* log(data, cont) {
    if (data.group === "reverse logs") {
      //console.log(data.args);
    }
    if (logs[data.group] == null) {
      logs[data.group] = [];
    }
    logs[data.group].push(data);
    return yield cont();
  }

  function* commitLogs(_, cont) {
    //console.log(logs);
    for (let key in logs) {
      console.group(key);
      logs[key].forEach(data => {
        console[data.method](...data.args);
      });
      console.groupEnd();
    }
    return yield cont();
  }

  return { log, commitLogs };
};

export function withLogGroup(group, comp) {
  return withHandler(
    {
      *log(data, cont) {
        yield op("log", Object.assign({}, data, { group }));
        return yield cont();
      }
    },
    comp
  );
}
