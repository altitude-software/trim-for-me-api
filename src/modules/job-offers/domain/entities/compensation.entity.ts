import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';

export enum CompensationType {
    NEGOTIABLE = 'negotiable',
    PER_MINUTE = 'per_minute',
    PER_VIDEO = 'per_video',
}

export interface CompensationProps {
    id?: Uuid;
    type: CompensationType;
    durationInMinutes?: number | null;
    amount?: number | null;
    currency?: string | null;
}

export class Compensation {
    readonly id: Uuid;
    private _type: CompensationType;
    private _durationInMinutes: number | null;
    private _amount: number | null;
    private _currency: string | null;

    private constructor(props: CompensationProps) {
        this.id = props.id ?? new Uuid();
        this._type = props.type;
        this._durationInMinutes = props.durationInMinutes ?? null;
        this._amount = props.amount ?? null;
        this._currency = props.currency ?? null;
        this.validate();
    }

    static create(props: CompensationProps): Compensation {
        return new Compensation(props);
    }

    static reconstitute(props: Required<CompensationProps>): Compensation {
        return new Compensation(props);
    }

    private validate(): void {
        const requiresAmount =
            this._type !== CompensationType.NEGOTIABLE;

        if (requiresAmount && this._amount === null) {
            throw new Error(
                `Compensation type "${this._type}" requires an amount.`,
            );
        }

        if (requiresAmount && this._currency === null) {
            throw new Error(
                `Compensation type "${this._type}" requires a currency.`,
            );
        }
        if (
            this._type === CompensationType.PER_MINUTE &&
            this._durationInMinutes === null
        ) {
            throw new Error(
                `Compensation type "${this._type}" requires durationInMinutes.`,
            );
        }
    }

    //   Getters
    get type(): CompensationType { return this._type; }
    get amount(): number | null { return this._amount; }
    get currency(): string | null { return this._currency; }
    get durationInMinutes(): number | null { return this._durationInMinutes; }

    isNegotiable(): boolean {
        return this._type === CompensationType.NEGOTIABLE;
    }
}