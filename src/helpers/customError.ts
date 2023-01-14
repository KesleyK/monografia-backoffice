export class CustomError extends Error {
    code: string;

    setCode(code) {
        this.code = code;
    }
}
