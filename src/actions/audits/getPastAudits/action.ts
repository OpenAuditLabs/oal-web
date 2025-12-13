import { actionClient } from "@/lib/action";
import { getPastAuditsLogic } from "./logic";

export const getPastAudits = actionClient.server.action(getPastAuditsLogic);
