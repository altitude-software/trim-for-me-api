import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';

export enum EditLevelType {
    BASIC = 'basic',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

export interface EditLevelProps {
    id?: Uuid;
    level: EditLevelType;
}

export class EditLevel {
    readonly id: Uuid;
    private _level: EditLevelType;

    private constructor(props: EditLevelProps) {
        this.id = props.id ?? new Uuid();
        this._level = props.level;
    }

    static create(props: EditLevelProps): EditLevel {
        return new EditLevel(props);
    }

    static reconstitute(props: Required<EditLevelProps>): EditLevel {
        return new EditLevel(props);
    }

    // Getters
    get level(): EditLevelType { return this._level; }
}