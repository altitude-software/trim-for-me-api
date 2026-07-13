import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';

export interface MaterialTypeProps {
    id?: Uuid;
    name: string;
}

export class MaterialType {
    readonly id: Uuid;
    private _name: string;

    private constructor(props: MaterialTypeProps) {
        this.id = props.id ?? new Uuid();
        this._name = props.name;
    }

    static create(props: MaterialTypeProps): MaterialType {
        return new MaterialType(props);
    }

    static reconstitute(props: Required<MaterialTypeProps>): MaterialType {
        return new MaterialType(props);
    }

    // Getters
    get name(): string { return this._name; }
}
