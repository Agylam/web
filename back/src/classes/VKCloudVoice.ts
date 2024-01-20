import { SpeechModel } from '../entities/Announcement.js';

export class VKCloudVoice {
    readonly CLOUD_VOICE_ENDPOINT = 'https://voice.mcs.mail.ru/tts';
    private readonly __CLOUD_VOICE_API_KEY = process.env.CLOUD_VOICE_API_KEY;

    constructor() {
        if (!this.__CLOUD_VOICE_API_KEY) {
            throw new Error('CLOUD_VOICE_API_KEY is not defined');
        }
        console.log('VKCloudVoice started');
    }

    // get mp3 from text (TTS by VK Cloud) and download it to temp folder
    async streamTTS(
        text: string,
        fileName: string,
        model_name: SpeechModel = SpeechModel.PAVEL_HIFIGAN,
        tempo: number = 1,
    ) {
        const urlKeys = new URLSearchParams({
            model_name,
            tempo: tempo.toString(),
            encoder: 'mp3',
        }).toString();
        const url = this.CLOUD_VOICE_ENDPOINT + '?' + urlKeys;

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                Authorization: 'Bearer ' + this.__CLOUD_VOICE_API_KEY,
            },
            body: text,
            redirect: 'follow',
        });
        if (resp.ok && resp.body) {
            // console.log('Writing to file:', fileName);
            // let writer = fs.createWriteStream(fileName);
            // @ts-ignore
            // Readable.fromWeb(resp.body).pipe(writer);
            return await resp.arrayBuffer();
        } else {
            console.error('Error while TTS:', resp.status, resp.statusText);
        }
        // return fileName;
    }
}
