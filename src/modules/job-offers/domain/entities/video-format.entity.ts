import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';

export enum VideoOrientation {
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
}

export enum VideoLength {
    SHORT = 'short',
    LONG = 'long',
}

export interface VideoFormatProps {
    id?: Uuid;
    orientation: VideoOrientation;
    length: VideoLength;
    technicalFormat?: string | null;
}

export class VideoFormat {
    readonly id: Uuid;
    private _orientation: VideoOrientation;
    private _length: VideoLength;
    private _technicalFormat: string | null;

    private constructor(props: VideoFormatProps) {
        this.id = props.id ?? new Uuid();
        this._orientation = props.orientation;
        this._length = props.length;
        this._technicalFormat = props.technicalFormat ?? null;
    }

    static create(props: VideoFormatProps): VideoFormat {
        return new VideoFormat(props);
    }

    // Getters
    get orientation(): VideoOrientation { return this._orientation; }
    get length(): VideoLength { return this._length; }
    get technicalFormat(): string | null { return this._technicalFormat; }
}