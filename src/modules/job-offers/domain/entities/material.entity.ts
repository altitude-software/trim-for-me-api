import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';

export interface MaterialProps {
    id?: Uuid;
    url?: string | null;
    type?: string | null;
    description?: string | null;
}

export class Material {
    readonly id: Uuid;
    private _url: string | null;
    private _type: string | null;
    private _description: string | null;

    private constructor(props: MaterialProps) {
        this.id = props.id ?? new Uuid();
        this._url = props.url ?? null;
        this._type = props.type ?? null;
        this._description = props.description ?? null;
    }

    static create(props: MaterialProps): Material {
        return new Material(props);
    }

    // Getters
    get url(): string | null { return this._url; }
    get type(): string | null { return this._type; }
    get description(): string | null { return this._description; }
}