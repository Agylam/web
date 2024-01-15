import * as fs from 'fs';

export class VKCloudVoice {
    readonly CLOUD_VOICE_ENDPOINT = 'https://voice.mcs.mail.ru/tts';
    private readonly __CLOUD_VOICE_API_KEY = process.env.CLOUD_VOICE_API_KEY;
    private readonly __TEMP_FOLDER = '../temp/';

    constructor() {}

    // get mp3 from text (TTS by VK Cloud) and download it to temp folder
    async saveTTS(text: string, name: string) {
        var fileName = this.__TEMP_FOLDER + name + '.mp3';
        request
            .get('http://foo.com/bar.mp3')
            .on('error', function (err) {
                // handle error
            })
            .pipe(fs.createWriteStream('2.mp3'));
    }
}
