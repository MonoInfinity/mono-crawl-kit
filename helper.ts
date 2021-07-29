const strPattern = {
        lettersAndNumbers: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        lettersAndNumbersLowerCase: 'abcdefghijklmnopqrstuvwxyz0123456789',
        lettersLowerCase: 'abcdefghijklmnopqrstuvwxyz',
        letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        number: '0123456789',
};

export function generatorString(length: number, type: keyof typeof strPattern = 'lettersAndNumbers') {
        let result = '';
        const characters = strPattern[type];
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
}

export function getExtension(filePath: string | null) {
        if (filePath !== null) return filePath.split('.').pop();
        return null;
}

export function getNewName(
        filePath: string | null,
        length: number,
        type: keyof typeof strPattern = 'lettersAndNumbers'
) {
        if (filePath !== null) {
                const extension = getExtension(filePath);

                return generatorString(length, type) + '.' + extension;
        }
        return null;
}
