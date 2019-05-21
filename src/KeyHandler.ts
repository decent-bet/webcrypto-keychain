import IKeyHandler from './IKeyHandler';
import IKeyStore from './IKeyStore';

export class KeyHandler implements IKeyHandler {
    /**
     * @param {IKeyStore} keyStore
     */
    constructor(private keyStore: IKeyStore) {}

    public async writeSecureValue(name: string, value: any): Promise<boolean> {
        const cryptoKey = await this.keyStore.getCryptoKeyWrapper()

        await this.keyStore.addVariable(
            name,
            await cryptoKey.encrypt(value)
        )
        return true;
    }

    public async getSecureValue(name: string): Promise<string> {
        const cryptoKey = await this.keyStore.getCryptoKeyWrapper()
        const blob = await this.keyStore.getVariable(name)
        if (blob) {
            return cryptoKey.decrypt(blob);
        }
        return Promise.reject('No key found');
    }

    public async clearStorage(): Promise<void> {
        await this.keyStore.clear()
    }
}
