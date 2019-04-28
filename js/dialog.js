function start() {
    fetch('/back/start', {
        method: 'GET',
        credentials: 'include'
    })
        .then(handleVoiceResponse)
        .then(playSound)
        .catch(err => {
            console.error(err)
        })
}

function onRecordStart() {
    startRecording();
    $('#recordButton').hide();
    $('#stopButton').show();
}

function onRecordedVoiceObtained(blob) {
    var url = URL.createObjectURL(blob);
    au = $('#audio')
    au[0].controls = true
    au[0].src = url
    au.show()

    fetch('/back/voice', {method: 'POST', credentials: 'include', body: blob})
        .then(handleVoiceResponse)
        .then(data => {
            playSound(data)
            fetch('/back/get_dialog', {method: 'GET', credentials: 'include'})
                .then(response => response.json())
                .then(addDialogMessage)
        })

}

function onRecordStop() {
    $('#recordButton').show();
    $('#stopButton').hide();
    stopRecording(onRecordedVoiceObtained);
}

function addDialogMessage(data) {
    const message = document.createElement('div');
    message.className = 'message'
    const input_phrase = document.createElement('div');
    input_phrase.innerText = data.input_phrase
    input_phrase.className = 'input-phrase'
    const text_to_show = document.createElement('div');
    text_to_show.innerText = data.text_to_show
    text_to_show.className = 'text-to-show'
    message.appendChild(input_phrase)
    message.appendChild(text_to_show)
    $('#dialog')[0].appendChild(message)
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
    let sound = $('#audio')[0];
    sound.controls = true
    sound.src = url;
    setTimeout(() => {
        try {
            sound.play();
        } catch (e) {
            console.log("can't play sound: ", e)
        }
    }, 1000)
}