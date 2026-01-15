import { userModelType, userMethods } from "./types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: userModelType & userMethods;
    }
  }
}

export {};
