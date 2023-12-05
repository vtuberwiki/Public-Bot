import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import ISlashCommand from "../../../interfaces/ISlashCommand";
import Sdk from "vtuberwiki-sdk";

const DESCRIPTION_LIMIT = 200;


export const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("get-software")
        .setDescription("Get info about a certain type of software.")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the software you want to get info for.")
                .setRequired(false)),
    async execute(interaction: CommandInteraction) {
        try {
            //@ts-ignore
            const name = interaction.options.getString("name");

            const sdk = Sdk.getInstance();

            const software = await sdk.getSoftware();

            if (!name) {

                const embed = new EmbedBuilder()
                    .setTitle("Software")
                    .setDescription("A list of all available software.\n\nView more: https://vtubers.wiki/wiki/software")
                    .setTimestamp()
                    .setFooter({
                        text: "Powered by https://vtubers.wiki/sdk/node",
                        iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                    });

                software.forEach((software: any, index: number) => {
                    if (index > 10) return;
                    embed.addFields({
                        name: software.name,
                        value: software.description ? software.description.substring(0, DESCRIPTION_LIMIT) + "..." : "No description.",
                    });
                });

                await interaction.reply({ embeds: [embed] });
                return;
            }

            // Find anything that matches the name lowercase (using a regex) (make it return an array)
            const matches = software.filter((_: any) => {
                const Name = _.name.toLowerCase();
                return name && Name.match(new RegExp(name.toLowerCase()));
              });

            // If there are no matches, return an error
            if (matches.length === 0) return await interaction.reply({ content: "No matches found.", ephemeral: true });

            // If there is only one match, use that
            if (matches.length === 1) {
                const software = matches[0];

                const embed = new EmbedBuilder()
                    .setTitle(software.name)
                    .setURL(`https://vtubers.wiki${software.link}`)
                    .setColor("Aqua")
                    .setImage(`${software.image}`)
                    .setDescription(software.description)
                    .addFields(
                        { name: "Author:", value: `[@${software.author}](https://github.com/${software.author})`, inline: true },
                    )
                    .setTimestamp()
                    .setFooter({
                        text: "Powered by https://vtubers.wiki/sdk/node",
                        iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                    });

                const showLinkButton = new ButtonBuilder()
                    .setLabel("Show on vtubers.wiki")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://vtubers.wiki${software.link}`)
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