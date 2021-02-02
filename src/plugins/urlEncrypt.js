const urlEncrypt = {
  Encrypt (str) {
    if (str == '') return '';
    str = escape(str);
    let pwd = 'ae8b516cbffde62a74b726c82eb6748ad41d251480d84ce2e96ebf57ebaa8b22';
    pwd = escape(pwd);
    if (pwd == null || pwd.length <= 0) {
      alert('Please enter a password with which to encrypt the message.');
      return null
    }
    let prand = '';
    for (let I = 0; I < pwd.length; I++) {
      prand += pwd.charCodeAt(I).toString()
    }
    const sPos = Math.floor(prand.length / 5);
    const mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    const incr = Math.ceil(pwd.length / 2);
    const modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
      alert('Algorithm cannot find a suitable hash. Please choose a different password. /nPossible considerations are to choose a more complex or longer password.');
      return null
    }
    let salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
      prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString()
    }
    prand = (mult * prand + incr) % modu;
    let encChr = '';
    let encStr = '';
    for (let I = 0; I < str.length; I++) {
      encChr = parseInt(str.charCodeAt(I) ^ Math.floor((prand / modu) * 255));
      if (encChr < 16) {
        encStr += '0' + encChr.toString(16)
      } else encStr += encChr.toString(16);
      prand = (mult * prand + incr) % modu
    }
    salt = salt.toString(16);
    while (salt.length < 8) salt = '0' + salt;
    encStr += salt;
    return encStr
  },

  Decrypt (str) {
    if (str == '') return '';
    let pwd = 'ae8b516cbffde62a74b726c82eb6748ad41d251480d84ce2e96ebf57ebaa8b22';
    pwd = escape(pwd);
    if (str == null || str.length < 8) {
      alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
      return
    }
    if (pwd == null || pwd.length <= 0) {
      alert('Please enter a password with which to decrypt the message.');
      return
    }
    let prand = '';
    for (let I = 0; I < pwd.length; I++) {
      prand += pwd.charCodeAt(I).toString()
    }
    const sPos = Math.floor(prand.length / 5);
    const mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    const incr = Math.round(pwd.length / 2);
    const modu = Math.pow(2, 31) - 1;
    const salt = parseInt(str.substring(str.length - 8, str.length), 16);
    str = str.substring(0, str.length - 8);
    prand += salt;
    while (prand.length > 10) {
      prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString()
    }
    prand = (mult * prand + incr) % modu;
    let encChr = '';
    let encStr = '';
    for (let I = 0; I < str.length; I += 2) {
      encChr = parseInt(parseInt(str.substring(I, I + 2), 16) ^ Math.floor((prand / modu) * 255));
      encStr += String.fromCharCode(encChr);
      prand = (mult * prand + incr) % modu
    }
    return unescape(encStr)
  }
}
export default urlEncrypt
