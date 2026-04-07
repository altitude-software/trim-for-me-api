import { randomUUID } from 'crypto';

export class Uuid {
    readonly value: string;

    constructor(value?: string) {
        this.value = value ?? randomUUID();
        this.validate();
    }

    private validate(): void {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(this.value)) {
            throw new Error(`Invalid UUID: ${this.value}`);
        }
    }

    equals(other: Uuid): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}