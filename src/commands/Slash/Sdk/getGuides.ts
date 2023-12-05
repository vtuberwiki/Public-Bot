import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import ISlashCommand from "../../../interfaces/ISlashCommand";
import Sdk from "vtuberwiki-sdk";


export const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("get-guide")
        .setDescription("Get info about a certain type of guide.")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the guide you want to get info for.")
                .setRequired(false)),
    async execute(interaction: CommandInteraction) {
        try {
            //@ts-ignore
            const name = interaction.options.getString("name");

            const sdk = Sdk.getInstance();

            const guides = await sdk.getGuides();

            if (!name) {

                const embed = new EmbedBuilder()
                    .setTitle("Guides")
                    .setDescription("A list of all available guides.\n\nView more: https://vtubers.wiki/wiki/guides")
                    .setTimestamp()
                    .setFooter({
                        text: "Powered by https://vtubers.wiki/sdk/node",
                        iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                    });

                guides.forEach((guide: any, index: number) => {
                    if (index > 10) return;

                    embed.addFields({
                        name: guide.title,
                        value: guide.description,
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
                    .setURL(`https://vtubers.wiki/wiki/guides/${guide.slug}`)
                    .setColor("Aqua")
                    .setImage(`${guide.image}`)
                    .setDescription(guide.description)
                    .addFields(
                        { name: "Author:", value: `[@${guide.author}](https://github.com/${guide.author})`, inline: true },
                    )
                    .setTimestamp()
                    .setFooter({
                        text: "Powered by https://vtubers.wiki/sdk/node",
                        iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                    });

                const showLinkButton = new ButtonBuilder()
                    .setLabel("Show on vtubers.wiki")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://vtubers.wiki/wiki/guides/${guide.slug}`)
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