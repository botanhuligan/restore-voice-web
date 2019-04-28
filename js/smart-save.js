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
    const encrypted = CryptoJS.AES.encrypt(pk, password)
    $('#aes_pk')[0].innerHTML = encrypted
}

function saveKeyInBlockchain() {
    const hashUserCode = $('#hash_user_code')[0].innerHTML
    const pk = $('#aes_pk')[0].innerHTML
    addKeyValue(hashUserCode, pk)
}