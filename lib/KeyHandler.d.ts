import IKeyHandler from './IKeyHandler';
import IKeyStore from './IKeyStore';
export declare class KeyHandler implements IKeyHandler {
    private keyStore;
    constructor(keyStore: IKeyStore);
    writeSecureValue(name: string, value: any): Promise<boolean>;
    getSecureValue(name: string): Promise<string>;
    clearStorage(): Promise<void>;
}
