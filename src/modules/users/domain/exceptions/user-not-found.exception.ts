import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
    constructor(id: string) {
        super(`User with id "${id}" was not found.`);
    }
}