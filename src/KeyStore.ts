import Dexie from 'dexie'
import IKeyStore from './IKeyStore';
import { CryptoKeyPairWrapper } from './CryptoKeyPairWrapper';
// Based partially from https://gist.github.com/saulshanabrook/b74984677bccd08b028b30d9968623f5

export class KeyStore implements IKeyStore {
    private db: Dexie

    /**
     * Creates a new KeyStore
     * @param dbName Key store database name, defaults to KeychainStore
     */
    constructor(dbName: string = 'KeychainStore') {
        this.db = new Dexie(dbName)
        this.db.version(1).stores({
            keys: 'id, value'
        })
    }

    /**
     * Creates non exportable crypto key
     */
    public async createCryptoKey(): Promise<CryptoKeyPair> {
        return window.crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: { name: 'SHA-256' }
            },
            false,
            ['encrypt', 'decrypt']
        )
    }

    /**
     * Gets an existing crypto key, else creates a new key
     * @param keyId Crypto key id to lookup, else uses default key id
     */
    public async getCryptoKey(keyId: string = 'keystoreKey'): Promise<CryptoKeyPair> {
        let keys = await this.db.table('keys').get(keyId)

        if (keys) {
            return keys.value
        } else {
            keys = await this.createCryptoKey()
            await this.db.table('keys').put({
                id: keyId,
                value: keys
            })
            return keys
        }
    }

    public async getCryptoKeyWrapper(keyId: string = 'keystoreKey'): Promise<CryptoKeyPairWrapper> {
        return new CryptoKeyPairWrapper(await this.getCryptoKey(keyId))
    }
    /**
     * Gets a variable from store
     * @param name Variable name to return
     */
    public async getVariable(name: string): Promise<any> {
        const record = await this.db.table('keys').get(name)
        return record && record.value ? record.value : null
    }
    /**
     * Gets all variables from store
     */
    public async getAllVariables(): Promise<string[]> {
        const records = await this.db.table('keys').toArray();
        return records.map(i => i.id);
    }
    /**
     * Clears a variable
     * @param name Variable name to return
     */
    public async clearVariable(name: string): Promise<void> {
        const record = await this.db.table('keys').get(name)
        if (record && record.value) {
            await this.db.table('keys').delete(name)
        }
    }

    /**
     * Adds a variable to store
     * @param name Variable name
     * @param value Variable value
     */
    public async addVariable(name: string, value: any): Promise<void> {
        return await this.db.table('keys').put({
            id: name,
            value
        })
    }

    /**
     * Encrypts data
     * @param data 
     * @param keys 
     */
    public encrypt(data: string, keys: CryptoKeyPair): PromiseLike<ArrayBuffer> {
        return window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
            },
            keys.publicKey,
            this.str2ab(data)
        )
    }

    /**
     * Decrypts data
     * @param data 
     * @param keys 
     */
    public async decrypt(data: ArrayBuffer, keys: CryptoKeyPair): Promise<string> {
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP'
            },
            keys.privateKey,
            data
        )

        return this.ab2str(new Uint8Array(decrypted))
    }

    /**
     * Clears database
     */
    public async clear(): Promise<void> {
        await this.db.delete()
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
