export const takeOneOrThrow =
    (message: string) =>
    <T>(values: T[]): T => {
        if (values.length < 1)
            throw new Error(`Found non unique or inexistent value: ${message}`);
        return values[0]!;
    };

export const takeUnique = <T>(values: T[]) => values[0];