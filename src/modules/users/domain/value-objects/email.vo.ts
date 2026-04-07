export class Email {
    readonly value: string;

    constructor(value: string) {
        this.value = this.validate(value);
    }

    private validate(value: string): string {
        const trimmed = value.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!trimmed) {
            throw new Error('Email cannot be empty.');
        }

        if (!emailRegex.test(trimmed)) {
            throw new Error(`Invalid email format: "${value}".`);
        }

        return trimmed;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}