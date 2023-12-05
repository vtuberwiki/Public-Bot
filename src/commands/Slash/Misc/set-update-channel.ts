import { SlashCommandBuilder, CommandInteraction, ChannelType } from "discord.js";
import ISlashCommand from "../../../interfaces/ISlashCommand";
import axios from "axios";
import config from "../../../config";


export const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("set-update-channel")
        .setDescription("Set a channel for designated updates to be sent to.")
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The channel you want to set as the designated update channel.")
                .addChannelTypes(ChannelType.GuildText)
        ),
    async execute(interaction: CommandInteraction) {
        //@ts-ignore
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        const options = {
            method: 'POST',
            url: `https://discord.com/api/v8/channels/${config.UpdatesChannel}/followers`,
            headers: {
                "Authorization": "Bot " + process.env.token,
            },
            data: {
                webhook_channel_id: channel.id
            }
        }

        await axios.request(options).then(async () => {
            await interaction.reply({ content: `Successfully set <#${channel.id}> as the designated update channel.`, ephemeral: true });
        });
    },
} as ISlashCommand;