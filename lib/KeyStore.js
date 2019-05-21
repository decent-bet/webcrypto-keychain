"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dexie_1 = __importDefault(require("dexie"));
const CryptoKeyPairWrapper_1 = require("./CryptoKeyPairWrapper");
// Based partially from https://gist.github.com/saulshanabrook/b74984677bccd08b028b30d9968623f5
class KeyStore {
    /**
     * Creates a new KeyStore
     * @param dbName Key store database name, defaults to KeychainStore
     */
    constructor(dbName = 'KeychainStore') {
        this.db = new dexie_1.default(dbName);
        this.db.version(1).stores({
            keys: 'id, value'
        });
    }
    /**
     * Creates non exportable crypto key
     */
    async createCryptoKey() {
        return window.crypto.subtle.generateKey({
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: 'SHA-256' }
        }, false, ['encrypt', 'decrypt']);
    }
    /**
     * Gets an existing crypto key, else creates a new key
     * @param keyId Crypto key id to lookup, else uses default key id
     */
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
    /**
     * Gets a variable from store
     * @param name Variable name to return
     */
    async getVariable(name) {
        const record = await this.db.table('keys').get(name);
        return record && record.value ? record.value : null;
    }
    /**
     * Clears a variable
     * @param name Variable name to return
     */
    async clearVariable(name) {
        const record = await this.db.table('keys').get(name);
        if (record && record.value) {
            await this.db.table('keys').delete(name);
        }
    }
    /**
     * Adds a variable to store
     * @param name Variable name
     * @param value Variable value
     */
    async addVariable(name, value) {
        return await this.db.table('keys').put({
            id: name,
            value
        });
    }
    /**
     * Encrypts data
     * @param data
     * @param keys
     */
    encrypt(data, keys) {
        return window.crypto.subtle.encrypt({
            name: 'RSA-OAEP'
        }, keys.publicKey, this.str2ab(data));
    }
    /**
     * Decrypts data
     * @param data
     * @param keys
     */
    async decrypt(data, keys) {
        const decrypted = await window.crypto.subtle.decrypt({
            name: 'RSA-OAEP'
        }, keys.privateKey, data);
        return this.ab2str(new Uint8Array(decrypted));
    }
    /**
     * Clears database
     */
    async clear() {
        await this.db.delete();
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
exports.KeyStore = KeyStore;
