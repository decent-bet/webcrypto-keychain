import { CryptoKeyPairWrapper } from "./CryptoKeyPairWrapper";
export default interface IKeyStore {
    createCryptoKey(): PromiseLike<CryptoKeyPair>;
    getCryptoKey(keyId?: string): Promise<CryptoKeyPair>;
    getCryptoKeyWrapper(keyId?: string): Promise<CryptoKeyPairWrapper>;
    getVariable(name: string): Promise<any>;
    addVariable(name: string, value: any): Promise<void>;
    encrypt(data: string, keys: CryptoKeyPair): PromiseLike<ArrayBuffer>;
    decrypt(data: ArrayBuffer, keys: CryptoKeyPair): PromiseLike<any>;
    clear(): Promise<void>;
    clearVariable(name: string): Promise<void>;
}
