import IKeyStore from './IKeyStore';
import { CryptoKeyPairWrapper } from './CryptoKeyPairWrapper';
export declare class KeyStore implements IKeyStore {
    private db;
    constructor(dbName?: string);
    createCryptoKey(): Promise<CryptoKeyPair>;
    getCryptoKey(keyId?: string): Promise<CryptoKeyPair>;
    getCryptoKeyWrapper(keyId?: string): Promise<CryptoKeyPairWrapper>;
    getVariable(name: string): Promise<any>;
    getAllVariables(): Promise<string[]>;
    clearVariable(name: string): Promise<void>;
    addVariable(name: string, value: any): Promise<void>;
    encrypt(data: string, keys: CryptoKeyPair): PromiseLike<ArrayBuffer>;
    decrypt(data: ArrayBuffer, keys: CryptoKeyPair): Promise<string>;
    clear(): Promise<void>;
    private ab2str;
    private str2ab;
}
