"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CryptoKeyPairWrapper {
    constructor(keyPair) {
        this.keyPair = keyPair;
    }
    /**
     * Encrypts data
     * @param data
     * @param keys
     */
    encrypt(data) {
        return window.crypto.subtle.encrypt({
            name: 'RSA-OAEP'
        }, this.keyPair.publicKey, this.str2ab(data));
    }
    /**
     * Decrypts data
     * @param data
     * @param keys
     */
    async decrypt(data) {
        const decrypted = await window.crypto.subtle.decrypt({
            name: 'RSA-OAEP'
        }, this.keyPair.privateKey, data);
        return this.ab2str(new Uint8Array(decrypted));
    }
    /**
     * Converts an array buffer to string
     * @param uint8array
     */
    ab2str(uint8array) {
        return new TextDecoder().decode(uint8array);
    }
    /**
     * Converts a string to array buffer
     * @param str
     */
    str2ab(str) {
        return new TextEncoder().encode(str);
    }
}
exports.CryptoKeyPairWrapper = CryptoKeyPairWrapper;
