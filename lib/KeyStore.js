"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dexie_1 = __importDefault(require("dexie"));
const CryptoKeyPairWrapper_1 = require("./CryptoKeyPairWrapper");
class KeyStore {
    constructor(dbName = 'KeychainStore') {
        this.db = new dexie_1.default(dbName);
        this.db.version(1).stores({
            keys: 'id, value'
        });
    }
    async createCryptoKey() {
        return window.crypto.subtle.generateKey({
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: 'SHA-256' }
        }, false, ['encrypt', 'decrypt']);
    }
    async getCryptoKey(keyId = 'keystoreKey') {
        let keys = await this.db.table('keys').get(keyId);
        if (keys) {
            return keys.value;
        }
        else {
            keys = await this.createCryptoKey();
            await this.db.table('keys').put({
                id: keyId,
                value: keys
            });
            return keys;
        }
    }
    async getCryptoKeyWrapper(keyId = 'keystoreKey') {
        return new CryptoKeyPairWrapper_1.CryptoKeyPairWrapper(await this.getCryptoKey(keyId));
    }
    async getVariable(name) {
        const record = await this.db.table('keys').get(name);
        return record && record.value ? record.value : null;
    }
    async getAllVariables() {
        const records = await this.db.table('keys').toArray();
        return records.map(i => i.id);
    }
    async clearVariable(name) {
        const record = await this.db.table('keys').get(name);
        if (record && record.value) {
            await this.db.table('keys').delete(name);
        }
    }
    async addVariable(name, value) {
        return await this.db.table('keys').put({
            id: name,
            value
        });
    }
    encrypt(data, keys) {
        return window.crypto.subtle.encrypt({
            name: 'RSA-OAEP'
        }, keys.publicKey, this.str2ab(data));
    }
    async decrypt(data, keys) {
        const decrypted = await window.crypto.subtle.decrypt({
            name: 'RSA-OAEP'
        }, keys.privateKey, data);
        return this.ab2str(new Uint8Array(decrypted));
    }
    async clear() {
        await this.db.delete();
    }
    ab2str(uint8array) {
        return new TextDecoder().decode(uint8array);
    }
    str2ab(str) {
        return new TextEncoder().encode(str);
    }
}
exports.KeyStore = KeyStore;
