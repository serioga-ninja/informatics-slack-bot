export const camelCaseToCebabCase = (str: string) => {
    return str
        .split('')
        .map(ch => ch.charCodeAt(0) < 97 ? `-${ch.toLowerCase()}` : ch)
        .join('');
};