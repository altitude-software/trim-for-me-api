import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Material } from './material.entity';
import { VideoFormat } from './video-format.entity';
import { EditLevel } from './edit-level.entity';
import { Compensation } from './compensation.entity';

export interface JobOfferProps {
    id?: Uuid;
    creatorId: Uuid;
    materials?: Material[];
    videoFormat?: VideoFormat | null;
    editLevel?: EditLevel | null;
    compensation?: Compensation | null;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class JobOffer {
    readonly id: Uuid;
    readonly creatorId: Uuid;
    private _materials: Material[];
    private _videoFormat: VideoFormat | null;
    private _editLevel: EditLevel | null;
    private _compensation: Compensation | null;
    private _description: string | null;
    readonly createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: JobOfferProps) {
        this.id = props.id ?? new Uuid();
        this.creatorId = props.creatorId;
        this._materials = props.materials ?? [];
        this._videoFormat = props.videoFormat ?? null;
        this._editLevel = props.editLevel ?? null;
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
    get materials(): Material[] { return [...this._materials]; }
    get videoFormat(): VideoFormat | null { return this._videoFormat; }
    get editLevel(): EditLevel | null { return this._editLevel; }
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

    setVideoFormat(videoFormat: VideoFormat): void {
        this._videoFormat = videoFormat;
        this.touch();
    }

    setEditLevel(editLevel: EditLevel): void {
        this._editLevel = editLevel;
        this.touch();
    }

    setCompensation(compensation: Compensation): void {
        this._compensation = compensation;
        this.touch();
    }

    setDescription(description: string): void {
        this._description = description;
        this.touch();
    }

    isComplete(): boolean {
        return (
            this._videoFormat !== null &&
            this._editLevel !== null &&
            this._compensation !== null
        );
    }

    private touch(): void {
        this._updatedAt = new Date();
    }
}