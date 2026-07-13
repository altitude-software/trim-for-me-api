import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Material } from './material.entity';
import { Compensation } from './compensation.entity';

export enum VideoOrientation {
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
}

export enum VideoLength {
    SHORT = 'short',
    LONG = 'long',
}

export enum EditLevelType {
    BASIC = 'basic',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

export interface JobOfferProps {
    id?: Uuid;
    creatorId: Uuid;
    name: string;
    materials?: Material[];
    orientation?: VideoOrientation;
    length?: VideoLength;
    level?: EditLevelType;
    compensation?: Compensation | null;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class JobOffer {
    readonly id: Uuid;
    readonly creatorId: Uuid;
    private _name: string;
    private _materials: Material[];
    private _orientation: VideoOrientation;
    private _length: VideoLength;
    private _level: EditLevelType;
    private _compensation: Compensation | null;
    private _description: string | null;
    readonly createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: JobOfferProps) {
        this.id = props.id ?? new Uuid();
        this.creatorId = props.creatorId;
        this._name = props.name;
        this._materials = props.materials ?? [];
        this._orientation = props.orientation ?? VideoOrientation.HORIZONTAL;
        this._length = props.length ?? VideoLength.LONG;
        this._level = props.level ?? EditLevelType.INTERMEDIATE;
        this._compensation = props.compensation ?? null;
        this._description = props.description ?? null;
        this.createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? new Date();
    }

    static create(props: JobOfferProps): JobOffer {
        return new JobOffer(props);
    }

    static reconstitute(props: Required<JobOfferProps>): JobOffer {
        return new JobOffer(props);
    }

    // Getters
    get name(): string { return this._name; }
    get materials(): Material[] { return [...this._materials]; }
    get orientation(): VideoOrientation { return this._orientation; }
    get length(): VideoLength { return this._length; }
    get level(): EditLevelType { return this._level; }
    get compensation(): Compensation | null { return this._compensation; }
    get description(): string | null { return this._description; }
    get updatedAt(): Date { return this._updatedAt; }

    // Setters
    addMaterial(material: Material): void {
        this._materials.push(material);
        this.touch();
    }

    removeMaterial(materialId: Uuid): void {
        this._materials = this._materials.filter(
            (m) => !m.id.equals(materialId),
        );
        this.touch();
    }

    setName(name: string): void {
        this._name = name;
        this.touch();
    }

    setOrientation(orientation: VideoOrientation): void {
        this._orientation = orientation;
        this.touch();
    }

    setLength(length: VideoLength): void {
        this._length = length;
        this.touch();
    }

    setLevel(level: EditLevelType): void {
        this._level = level;
        this.touch();
    }

    setCompensation(compensation: Compensation | null): void {
        this._compensation = compensation;
        this.touch();
    }

    setDescription(description: string | null): void {
        this._description = description;
        this.touch();
    }

    isComplete(): boolean {
        return this._compensation !== null;
    }

    private touch(): void {
        this._updatedAt = new Date();
    }
}
