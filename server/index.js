import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import * as dotenv from 'dotenv'


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
                model: "gpt-3.5-turbo"
            }
        );
        console.log("Successfully got response from openai")
        
        const ttsaudio = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: response.choices[0].message.content,
          });
        
        res.status(200).send({
            gptresponse: response.choices[0].message.content,
            audio: ttsaudio
        })
    } 
    catch (error) {
        console.log(error)
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'))
