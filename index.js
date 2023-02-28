import qrcode from 'qrcode-terminal';

import { Client } from 'whatsapp-web.js';
import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv'; 


dotenv.config(); 
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false
    }
    });

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

client.on('message', async (message) => {
    
try {
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: `${message.body}`,
  max_tokens: 2048,
  temperature: 0,
  "n": 1,
});

//const data = await response.json();
//response = response.json();
const d = response.data.choices[0].text;

client.sendMessage(message.from, d.trim() );
}
catch(error){
    console.error(`error: ${error}`);
  };
});
