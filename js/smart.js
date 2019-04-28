// Code goes here
const keySize = 256;
const ivSize = 128;
const iterations = 100;

function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function countHashCode() {
    const systemCode = $('#system_code').val()
    const hashSystemCode = CryptoJS.SHA256(systemCode)
    $('#hash_system_code')[0].innerHTML = hashSystemCode

    const userCode = $('#user_code').val()
    const hashUserCode = CryptoJS.SHA256(userCode)
    $('#hash_user_code')[0].innerHTML = hashUserCode

    const hashCode = CryptoJS.SHA256(hashSystemCode + hashUserCode)
    $('#hash_code')[0].innerHTML = hashCode
}

function aesPrivateKey() {
    const pk = $('#pk').val()
    const password = $('#hash_code')[0].innerHTML
    const encrypted = encrypt(pk, password)
    $('#aes_pk')[0].innerHTML = encrypted
}

function saveKeyInBlockchain() {
    const hashUserCode = $('#hash_user_code')[0].innerHTML
    const pk = $('#aes_pk')[0].innerHTML
    addKeyValue(hashUserCode, pk).then(data => {
        console.log('Key was successfully saved')
    })
}

function restoreKeyFromBlockchain() {
    const hashUserCode = $('#hash_user_code')[0].innerHTML
    const password = $('#hash_code')[0].innerHTML
    getValue(hashUserCode).then(key => {
        console.log('text to decrypt:' + key)
        const pk = decrypt(key, password)
        $('#private_key')[0].innerHTML = pk
    })
}

function encrypt (msg, pass) {
    return CryptoJS.AES.encrypt(msg, pass)
    // let salt = CryptoJS.lib.WordArray.random(128/8);
    //
    // let key = CryptoJS.PBKDF2(pass, salt, {
    //     keySize: keySize/32,
    //     iterations: iterations
    // });
    //
    // let iv = CryptoJS.lib.WordArray.random(128/8);
    //
    // let encrypted = CryptoJS.AES.encrypt(msg, key, {
    //     iv: iv,
    //     padding: CryptoJS.pad.Pkcs7,
    //     mode: CryptoJS.mode.CBC
    //
    // });
    //
    // // salt, iv will be hex 32 in length
    // // append them to the ciphertext for use  in decryption
    // let transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
    // return transitmessage;
}

function decrypt (transitmessage, pass) {
    const decrypted = CryptoJS.AES.decrypt(transitmessage, pass);
    return decrypted.toString(CryptoJS.enc.Utf8)
    // let salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    // let iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    // let encrypted = transitmessage.substring(64);
    //
    // let key = CryptoJS.PBKDF2(pass, salt, {
    //     keySize: keySize/32,
    //     iterations: iterations
    // });
    //
    // let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    //     iv: iv,
    //     padding: CryptoJS.pad.Pkcs7,
    //     mode: CryptoJS.mode.CBC
    //
    // })
    // return decrypted;
}