import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

export class EmailAlreadyInUseException extends DomainException {
    constructor(email: string) {
        super(`Email "${email}" is already in use.`);
    }
}