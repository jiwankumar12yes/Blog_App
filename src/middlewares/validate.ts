
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): any => {
    // console.log(req.body);
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          status: 'fail',
          errors: err.errors
        });
        return;
      }
      next(err);
    }
  };