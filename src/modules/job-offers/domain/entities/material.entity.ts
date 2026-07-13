import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';

export interface MaterialProps {
    id?: Uuid;
    url?: string | null;
    type?: Uuid | null;
    description?: string | null;
    duration?: number | null;
    quantity?: number | null;
}

export class Material {
    readonly id: Uuid;
    private _url: string | null;
    private _type: Uuid | null;
    private _description: string | null;
    private _duration: number | null;
    private _quantity: number | null;

    private constructor(props: MaterialProps) {
        this.id = props.id ?? new Uuid();
        this._url = props.url ?? null;
        this._type = props.type ?? null;
        this._description = props.description ?? null;
        this._duration = props.duration ?? null;
        this._quantity = props.quantity ?? null;
        this.validate();
    }

    static create(props: MaterialProps): Material {
        return new Material(props);
    }

    static reconstitute(props: Required<MaterialProps>): Material {
        return new Material(props);
    }

    private validate(): void {
        if (this._quantity !== null && this._quantity < 0) {
            throw new Error('Material quantity cannot be negative.');
        }
        if (this._duration !== null && this._duration < 0) {
            throw new Error('Material duration cannot be negative.');
        }
    }

    // Getters
    get url(): string | null { return this._url; }
    get type(): Uuid | null { return this._type; }
    get description(): string | null { return this._description; }
    get duration(): number | null { return this._duration; }
    get quantity(): number | null { return this._quantity; }
}
