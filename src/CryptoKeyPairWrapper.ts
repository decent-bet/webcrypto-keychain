export class CryptoKeyPairWrapper {
    constructor(private keyPair: CryptoKeyPair) {}
    /**
     * Encrypts data
     * @param data
     * @param keys
     */
    public encrypt(data: string): PromiseLike<ArrayBuffer> {
        return window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
            },
            this.keyPair.publicKey,
            this.str2ab(data)
        )
    }

    /**
     * Decrypts data
     * @param data
     * @param keys
     */
    public async decrypt(data: ArrayBuffer): Promise<string> {
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP'
            },
            this.keyPair.privateKey,
            data
        )

        return this.ab2str(new Uint8Array(decrypted))
    }

    /**
     * Converts an array buffer to string
     * @param uint8array
     */
    private ab2str(uint8array): string {
        return new TextDecoder().decode(uint8array)
    }

    /**
     * Converts a string to array buffer
     * @param str
     */
    private str2ab(str): Uint8Array {
        return new TextEncoder().encode(str)
    }
}
