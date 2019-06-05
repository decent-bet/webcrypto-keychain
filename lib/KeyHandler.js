"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyHandler {
    constructor(keyStore) {
        this.keyStore = keyStore;
    }
    async writeSecureValue(name, value) {
        const cryptoKey = await this.keyStore.getCryptoKeyWrapper();
        await this.keyStore.addVariable(name, await cryptoKey.encrypt(value));
        return true;
    }
    async getSecureValue(name) {
        const cryptoKey = await this.keyStore.getCryptoKeyWrapper();
        const blob = await this.keyStore.getVariable(name);
        if (blob) {
            return cryptoKey.decrypt(blob);
        }
        return Promise.reject('No key found');
    }
    async clearStorage() {
        await this.keyStore.clear();
    }
}
exports.KeyHandler = KeyHandler;
