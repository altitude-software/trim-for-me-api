import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

export class JobOfferNotFoundException extends DomainException {
    constructor(id: string) {
        super(`JobOffer with id "${id}" was not found.`);
    }
}