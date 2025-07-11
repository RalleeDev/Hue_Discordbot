import { Client, Collection, Events, GatewayIntentBits, MessageFlags }from 'discord.js';
import 'dotenv/config'
import fs from 'node:fs';
import path from 'node:path';
import { UpdateCommands } from './util';

UpdateCommands();

// Adding commands as a collectrion of a client objevct
declare module 'discord.js' {
	interface Client {
		commands: Collection<string, any>;
	}
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
		const filePath = path.join(foldersPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
};

client.once(Events.ClientReady, readyClient => {
    console.log('The discord bot is now online');
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    //Return early if the command doenst exist on the bots end
    if (!command)  { 
        console.error(`No command matching the name ${interaction.commandName}`) 
        return;
    }

    try  {
        await command.execute(interaction)
    } catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
    }
});

client.login(process.env.token);