import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import ISlashCommand from "../../../interfaces/ISlashCommand";
import Sdk from "vtuberwiki-sdk";

function FormatBody(body: string) {
    return body + "\n\n# Full Change Log\n\nTo view the full changelog, visit https://vtubers.wiki/changelog";
}

export const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("get-change-logs")
        .setDescription("Get info about our change logs.")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the change log you want to get info for.")
                .setRequired(false)),
    async execute(interaction: CommandInteraction) {
        try {
            //@ts-ignore
            const name = interaction.options.getString("name");

            const sdk = Sdk.getInstance();

            const guides = await sdk.getChangeLogs();

            if (!name) {

                const embed = new EmbedBuilder()
                    .setTitle("Change Logs")
                    .setDescription("A list of all available Change Logs.\n\nView more: https://vtubers.wiki/changelog")
                    .setTimestamp()
                    .setFooter({
                        text: "Powered by https://vtubers.wiki/sdk/node",
                        iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                    });

                guides.forEach((guide: any, index: number) => {
                    if (index > 10) return;

                    embed.addFields({
                        name: guide.name,
                        value: "\u200B"
                    });
                });

                await interaction.reply({ embeds: [embed] });
                return;
            }

            // Find anything that matches the name lowercase (using a regex) (make it return an array)
            const matches = guides.filter((_: any) => {
                const Name = _.name.toLowerCase();
                return name && Name.match(new RegExp(name.toLowerCase()));
              });

            // If there are no matches, return an error
            if (matches.length === 0) return await interaction.reply({ content: "No matches found.", ephemeral: true });

            // If there is only one match, use that
            if (matches.length === 1) {
                const guide = matches[0];


                const embed = new EmbedBuilder()
                    .setTitle(guide.name)
                    .setURL(`https://vtubers.wiki/changelog#${guide.slug}`)
                    .setColor("Aqua")
                    .setDescription(FormatBody(guide.body))
                    .setTimestamp()
                    .setFooter({
                        text: "Powered by https://vtubers.wiki/sdk/node",
                        iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                    });

                const showLinkButton = new ButtonBuilder()
                    .setLabel("Show on vtubers.wiki")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://vtubers.wiki/changelog#${guide.slug}`)
                    .setEmoji("ℹ️");

                const row = new ActionRowBuilder()
                    .addComponents(showLinkButton);

                //@ts-ignore
                await interaction.reply({ embeds: [embed], components: [row] });

            } else {
                // If there are multiple matches, return a list of them
                function makeList(array: any[]) {
                    let list = "";
                    array.forEach((item: any) => {
                        list += `[**${item.name}**](https://vtubers.wiki${item.link})\n`;
                    })
                    return list;
                }
                const embed = new EmbedBuilder()
                    .setTitle("Multiple matches found.")
                    .setDescription(makeList(matches))
                    .setTimestamp()
                    .setFooter({
                        text: "Powered by https://vtubers.wiki/sdk/node",
                        iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                    });


                await interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    },
} as ISlashCommand;