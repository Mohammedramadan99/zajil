import { Request, Response, NextFunction } from "express";

export default interface ICRUDController {
  create(req: Request, res: Response, next?: NextFunction): void;
  getAll(req: Request, res: Response, next?: NextFunction): void;
  getOne(req: Request, res: Response, next?: NextFunction): void;
  update(req: Request, res: Response, next?: NextFunction): void;
  delete(req: Request, res: Response, next?: NextFunction): void;
}
