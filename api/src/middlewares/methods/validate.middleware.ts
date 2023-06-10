import { validateDto } from '../../helpers';

export const validateMiddleware =
    (dto: any, isQuery: boolean = false) =>
    (req: any, res: any, next: any) => {
        const body = validateDto(dto, isQuery ? req.query : req.body);
        
        isQuery ? (req.query = body) : (req.body = body);
        next();
    };
