function sendName() {
    user_name = $('#user_name').val()
    fetch('/back/add_user/name', {
        method: 'POST',
        body: JSON.stringify({name: user_name}),
        headers: {'Content-Type': 'application/json; utf-8'},
        credentials: 'include'
    })
        .then(resp => {
            console.log('Name was successfully sent')
            $('#user_name')[0].disabled = true
            $('#register_user_name')[0].disabled = true
        })
        .catch(err => {
            console.error(err)
        })
}

function sendControlWords() {
    const word1 = $('#word1').val()
    const word2 = $('#word2').val()
    const word3 = $('#word3').val()
    const word4 = $('#word4').val()
    const word5 = $('#word5').val()
    const data = {words: [word1, word2, word3, word4, word5]}

    fetch('/back/add_user/words', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    })
        .then(resp => {
            console.log('Control words were successfully sent')
            $('#word1')[0].disabled = true
            $('#word2')[0].disabled = true
            $('#word3')[0].disabled = true
            $('#word4')[0].disabled = true
            $('#word5')[0].disabled = true
            $('#send_control_words')[0].disabled = true
        })
        .catch(err => {
            console.error(err)
        })
}

function onRecordStart() {
    startRecording();
    $('#recordButton').hide();
    $('#stopButton').show();
}

function onVoiceObtained(blob) {
    var url = URL.createObjectURL(blob);
    au = $('#audio')
    au[0].controls = true
    au[0].src = url
    au.show()

    function sendWav() {
        console.log('sending wav')
        fetch('/back/add_user/voice', {method: 'POST', body: blob, credentials: 'include'})
            .then(response => {
                console.log('response: ', response)
                if (response.headers && response.headers.get('Content-Type') === 'application/json') {
                    response.json()
                        .then(resp => {
                            console.log('Получили системный код')
                            $('#system_code_container').show()
                            $('#system_code')[0].innerHTML = resp['gen_secret']
                        })
                } else {
                    handleVoiceResponse(response).then(playSound)
                }
            })
    }

    btn = $('#send')
    btn.click(sendWav)
    btn.show()
}

function onRecordStop() {
    $('#recordButton').show();
    $('#stopButton').hide();
    stopRecording(onVoiceObtained);
}

function handleVoiceResponse(response) {
    const reader = response.body.getReader();
    // read() returns a promise that resolves
    // when a value has been received
    return reader
        .read()
        .then((result) => {
            return result;
        });
}

function playSound(data) {
    const blob = new Blob([data.value], {type: 'audio/mp3'});
    let url = URL.createObjectURL(blob);
    console.log('url of sound to play: ' + url);
    let sound = document.createElement('audio');
    sound.id = "audio"
    sound.src = url;
    sound.play();
    audio = document.getElementById('audio');
    audio.parentNode.removeChild(audio);
}