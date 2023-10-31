// RSA加密
import JSEncrypt from 'jsencrypt';

export function getRsaCode(str) {
  // 注册方法
  const pubKey =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMCvuROelOvtv3DrvOuG3cWlMOCF6kjXtqxyjTyLJP9wCupe5M2XNok9gG5j8K8L2TVHGhLHZuCSKMIXl5/PYh++vhKtDG8uxUit9+vo9yCK7trRU1UZbQQ83Uep0ybNlkd25B2aQjJcrTxDJiyEMBGKqjPQhQzeR+EYLfnAIGpwIDAQAB'; // ES6 模板字符串 引用 rsa 公钥
  const encryptStr = new JSEncrypt();
  encryptStr.setPublicKey(pubKey); // 设置 加密公钥
  const data = encryptStr.encrypt(str.toString()); // 进行加密
  return data;
}