export default interface IKeyHandler {
    writeSecureValue(name: string, value: any): Promise<boolean>;
    getSecureValue(name: string): Promise<string>;
    clearStorage(): Promise<void>;
}
