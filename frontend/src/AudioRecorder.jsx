import lamejs from 'lamejs';

function audioRecorder(myBuffer) {
    // const audioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100 * 10, 44100);
    // // Create the source node.
    // const source = audioContext.createBufferSource();
    // source.buffer = myBuffer;  // This is your audio buffer.

    // // Create the script processor node.
    // const processor = audioContext.createScriptProcessor(4096, 1, 1);

    // source.connect(processor);
    // processor.connect(audioContext.destination);

    // source.start();

    // var mp3encoder = new lamejs.Mp3Encoder(1, 44100, 128);  // 1 for mono, 44100 sample rate, 128 kbps bitrate
    // var mp3Data = [];

    // processor.onaudioprocess = function (event) {
    //     var input = event.inputBuffer.getChannelData(0);
    //     var mp3buf = mp3encoder.encodeBuffer(convertFloat32ToInt16(input));
    //     if (mp3buf.length > 0) {
    //         mp3Data.push(mp3buf);
    //     }
    // };

    // audioContext.oncomplete = function () {
    //     var mp3buf = mp3encoder.flush();   // finish writing mp3
    //     if (mp3buf.length > 0) {
    //         mp3Data.push(mp3buf);
    //     }
    //     var blob = new Blob(mp3Data, { type: 'audio/mp3' });
    //     var url = URL.createObjectURL(blob);
    //     const audio = new Audio()    
    //     audio.src = url
    //     audio.play()
    //     // Now you can use the URL for downloading, playing, or storing the MP3.
    // };

    // audioContext.startRendering();
}

function convertFloat32ToInt16(buffer) {
    var l = buffer.length;
    var buf = new Int16Array(l);
    while (l--) {
        buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf;
}

export {
    audioRecorder,
    convertFloat32ToInt16
};