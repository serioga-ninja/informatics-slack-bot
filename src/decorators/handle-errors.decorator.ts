export function HandleErrorsDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let method: () => Promise<any> = descriptor.value;

    descriptor.value = function (...args) {
        console.log(`"${propertyKey}" method starts`);
        return method
            .apply(target, args)
            .then((data: any) => {
                console.log(`"${propertyKey}" method finished`)
                return Promise.resolve(data);
            })
            .catch(error => {
                console.error(error);
            })
    };
}