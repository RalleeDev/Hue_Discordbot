import { Client, Events, GatewayIntentBits }from 'discord.js';
import 'dotenv/config'

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log('The discord bot is now online');
});

client.login(process.env.token)