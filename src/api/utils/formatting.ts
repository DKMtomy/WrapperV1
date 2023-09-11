export function snakeCaseToCamelCase(input: string): string {
    return input.replace(/_\w/g, match => {
        return match.substring(1).toUpperCase();
    });
}

export function camelCaseToSnakeCase(input: string): string {
    return input.replace(/([A-Z])/g, '_$1').toLowerCase();
}
