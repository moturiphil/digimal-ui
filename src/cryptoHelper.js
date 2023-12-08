const CryptoJS = require("crypto-js");
const key = "KaribuKenya";

export const encrypt = (data) => {
    const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return cipherText;
};

export const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return originalText;
};
