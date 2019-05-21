export default interface IKeyHandler {

    /**
     * Writes a secure value, returns true
     * @param name Key
     * @param value Value
     */
    writeSecureValue(name: string, value: any): Promise<boolean>;

    /**
     * Reads a secure value, returns a decrypted value
     * @param name Key
     */
    getSecureValue(name: string): Promise<string>;

    /**
     * Clears values from storage
     */
    clearStorage(): Promise<void>
}
