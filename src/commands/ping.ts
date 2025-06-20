import  { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Answers with Pong'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Pong')
    }
}