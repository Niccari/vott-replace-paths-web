/*
The MIT License

Copyright (c) 2016-2019 Microsoft Commercial Software Engineering

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { enc, lib, AES } from "crypto-js";

export const encrypt = (message: string, secret: string): string => {
  try {
    const secretBytes = enc.Base64.parse(secret);
    const iv = lib.WordArray.random(24);
    const encrypted = AES.encrypt(message, secretBytes, { iv });
    const json = {
      ciphertext: encrypted.ciphertext.toString(),
      iv: iv.toString(),
    };
    const words = enc.Utf8.parse(JSON.stringify(json));

    return enc.Base64.stringify(words);
  } catch (e) {
    throw new Error("encryption failed");
  }
};

export const encryptObject = (message: unknown, secret: string): string => {
  return encrypt(JSON.stringify(message), secret);
};
