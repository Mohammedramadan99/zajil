import { HttpError } from '../../common';
import { RequestMod } from '../../common/interfaces/request.mod';

export const canAccessCardsTemplatesMiddleware = (req: RequestMod, res, next) => {
    const businessId = Number(req.params.businessId);
    const userBusinesses = req.user.businesses.map((business) => business.id);
    if (userBusinesses.includes(businessId)) {
        next();
    } else {
        next(new HttpError(403, 'This business does not belong to the user'));
    }
};
