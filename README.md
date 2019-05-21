# webcrypto-keychain


`webcrypto-keychain` uses WebCrypto RSA-OAEP for encryption.

>Reference: https://github.com/diafygi/webcrypto-examples

## Install

`npm install -S @decent-bet/webcrypto-keychain`

## Usage

```typescript
import { KeyHandler, KeyStore } from '@decent-bet/webcrypto-keychain';

const keyStore = new KeyStore();
const keyHandler = new KeyHandler(keyStore);

// Write value
await keyHandler.writeSecureValue('hello', 'world');

// Read value
const world = await keyHandler.readSecureValue('hello');

```

## API definition

```typescript
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
```