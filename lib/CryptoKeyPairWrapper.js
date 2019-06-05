"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CryptoKeyPairWrapper {
    constructor(keyPair) {
        this.keyPair = keyPair;
    }
    encrypt(data) {
        return window.crypto.subtle.encrypt({
            name: 'RSA-OAEP'
        }, this.keyPair.publicKey, this.str2ab(data));
    }
    async decrypt(data) {
        const decrypted = await window.crypto.subtle.decrypt({
            name: 'RSA-OAEP'
        }, this.keyPair.privateKey, data);
        return this.ab2str(new Uint8Array(decrypted));
    }
    ab2str(uint8array) {
        return new TextDecoder().decode(uint8array);
    }
    str2ab(str) {
        return new TextEncoder().encode(str);
    }
}
exports.CryptoKeyPairWrapper = CryptoKeyPairWrapper;
