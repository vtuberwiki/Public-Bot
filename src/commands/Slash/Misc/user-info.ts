import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import ISlashCommand from "../../../interfaces/ISlashCommand";


export const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get user info.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user you want to get info from.")),
    async execute(interaction: CommandInteraction) {
        const user = interaction.options.getUser("user") || interaction.user;

        function getAvatar(user: any) {
            if (user.avatar) {
                return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar?.startsWith("a_") ? "gif" : "png"}`;
            } else {
                return `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}${user.discriminator ? `#${user.discriminator}` : ""}`)
            .setThumbnail(getAvatar(user))
            .setAuthor({
                name: user.tag,
                iconURL: getAvatar(user),
                url: `https://discord.com/users/${user.id}`,
            })
            .addFields(
                { name: "Username", value: user.username, inline: false },
                { name: "Discriminator", value: user.discriminator, inline: false },
                { name: "ID", value: user.id, inline: false },
                { name: "Bot", value: user.bot ? "Yes" : "No", inline: false },
                { name: "System", value: user.system ? "Yes" : "No", inline: false },
                { name: "Created At", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: false },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

    },
} as ISlashCommand;