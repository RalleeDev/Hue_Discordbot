import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

export function UpdateCommands() {

    if (!process.env.token) return;
    
    const rest = new REST().setToken(process.env.token);
    const commands = []

    const foldersPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    (async () => {
    //Return early if clientId or GuildId is not defined to prevent errors
    if (!process.env.clientId || !process.env.guildId) return;

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);


		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
			{ body: commands },
		) as any;

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
}