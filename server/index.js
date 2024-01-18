import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import * as dotenv from 'dotenv'

import path from 'path'
import fs from 'fs'

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.API_KEY
})

app.get('/', async(req, res) => {
    res.status(200).send({
        message: "Hello from APP"
    })
})

app.post('/', async(req, res) => {
    try {
        console.log(req.body.message)
        const response = await openai.chat.completions.create(
            {
                messages: req.body.message,
                model: "gpt-3.5-turbo",
                max_tokens: 500
            }
        );
        console.log("Successfully got response from openai")
        res.status(200).json({
            gptresponse: response.choices[0].message.content,
        })
    } 
    catch(error) {
        console.log(error)
    }
});

app.post('/dynamic-mp3', async(req, res) => {
    try {
        const ttsaudio = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: req.body.message,
        });
        const mp3Buffer = Buffer.from(await ttsaudio.arrayBuffer());
        //const speechfile = path.resolve("./speech.mp3");
        //await fs.promises.writeFile(speechFile, mp3Buffer);
        //res.status(200).sendFile("src/audioFile.mp3", "./speech.mp3");
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': mp3Buffer.length
        });
        console.log(mp3Buffer)
        res.send(mp3Buffer);

        // console.log(ttsaudio)
        // res.send(ttsaudio);
    } catch(error) {
        console.log(error);
    }
})
app.listen(3000, () => console.log('Server is running on port 3000'))



