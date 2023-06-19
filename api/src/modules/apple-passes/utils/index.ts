import { promises as fs } from 'fs';
import path from 'path';
import { Card } from '../../cards/models/card.model';
import { CardTemplate, CardType } from '../../card-templates/models/card-template.model';
import { LoyaltyCard } from '../../cards/models/loyalty-card.model';

interface Cache {
    certificates:
        | {
              signerCert: Buffer | string;
              signerKey: Buffer | string;
              wwdr: Buffer | string;
          }
        | undefined;
}

const cache: Cache = {
    certificates: undefined,
};

export async function getCertificates(): Promise<Exclude<Cache['certificates'], undefined>> {
    if (cache.certificates) {
        return cache.certificates;
    }

    const [signerCert, signerKey, wwdr] = await Promise.all([
        fs.readFile(path.resolve(__dirname, '../../../certs/signerCert.pem')),
        fs.readFile(path.resolve(__dirname, '../../../certs/signerKey.key')),
        fs.readFile(path.resolve(__dirname, '../../../certs/wwdr.pem')),
    ]);

    cache.certificates = {
        signerCert,
        signerKey,
        wwdr,
    };

    return cache.certificates;
}

export const populateVariables = async (str: string, cardId: number) => {
    // get card
    const card = (await Card.findOne({
        where: { id: cardId },
        include: [
            {
                model: CardTemplate,
                as: 'cardTemplate',
            },
        ],
    })) as Card & { cardTemplate: CardTemplate };

    const cardType = card.cardTemplate.cardType;

    switch (cardType) {
        case CardType.LOYALTY:
            const loyaltyCard = await LoyaltyCard.findOne({
                where: { id: cardId },
            });

            // replace {{points}} with loyalty points
            str = str.replace(/{{points}}/g, loyaltyCard.points.toString());
    }

    return str;
};
