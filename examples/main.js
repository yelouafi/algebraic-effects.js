import { start, withHandler } from "../algebraic-effects";
import { grouppedLogs, commitLogs } from "./logger";

import basicExample from "./basic";
import readExample from "./read";
import delayExample from "./async";
import exceptionsExample from "./exceptions";
import collectLogsExample from "./collect";
import reverseLogsExample from "./reverse";
import stateClosureExample from "./state-closure";
import statePureExample from "./state-pure";

function* main() {
  yield basicExample;
  yield readExample;
  yield delayExample;
  yield exceptionsExample;
  yield collectLogsExample;
  yield reverseLogsExample;
  yield stateClosureExample;
  yield statePureExample;
  yield commitLogs;
}

start(withHandler(grouppedLogs(), main()));
