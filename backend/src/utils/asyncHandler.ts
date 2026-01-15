import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: ErrorRequestHandler | any) {
      res.status(error.code || 404).json({
        message: error.message,
        success: false,
      });
    }
  };
};

export default asyncHandler;