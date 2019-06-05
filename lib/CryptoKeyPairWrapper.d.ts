export declare class CryptoKeyPairWrapper {
    private keyPair;
    constructor(keyPair: CryptoKeyPair);
    encrypt(data: string): PromiseLike<ArrayBuffer>;
    decrypt(data: ArrayBuffer): Promise<string>;
    private ab2str;
    private str2ab;
}
