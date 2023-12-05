import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events } from "discord.js";
import ISlashCommand from "../../../interfaces/ISlashCommand";
import Sdk from "vtuberwiki-sdk";






export const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("get-vtuber")
        .setDescription("Get info about a vtuber.")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the vtuber you want to get info for.")
                .setRequired(false)),
    async execute(interaction: CommandInteraction) {
        try {
            //@ts-ignore
            const name = interaction.options.getString("name");

            const sdk = Sdk.getInstance();

            const vtubers = await sdk.getVtubers();

            if (!name) {
                    
                    const embed = new EmbedBuilder()
                        .setTitle("Vtubers")
                        .setDescription("A list of all available vtubers.\n\nView more: https://vtubers.wiki/wiki/vtubers")
                        .setTimestamp()
                        .setFooter({
                            text: "Powered by https://vtubers.wiki/sdk/node",
                            iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                        });
    
                    vtubers.forEach((vtuber: any, index: number) => {
                        // Check if the index is more than 10
                        if (index > 10) return;

                        embed.addFields({
                            name: vtuber.name,
                            value: vtuber.description,
                        });
                    });
    
                    await interaction.reply({ embeds: [embed] });
                    return;
            }

            // Find anything that matches the name lowercase (using a regex) (make it return an array)
            const matches = vtubers.filter((vtuber: any) => {
                const vtuberName = vtuber.name.toLowerCase();
                return name && vtuberName.match(new RegExp(name.toLowerCase()));
            });

            // If there are no matches, return an error
            if (matches.length === 0) return await interaction.reply({ content: "No matches found.", ephemeral: true });

            // If there is only one match, use that
            if (matches.length === 1) {
                const vtuber = matches[0];

                const embed = new EmbedBuilder()
                    .setTitle(vtuber.name)
                    .setURL(`https://vtubers.wiki${vtuber.link}`)
                    .setColor(vtuber.border_color)
                    .setThumbnail(`https://vtubers.wiki${vtuber.image}`)
                    .setImage(`https://vtubers.wiki${vtuber.banner}`)
                    .setDescription(vtuber.description)
                    .addFields(
                        { name: "Category:", value: vtuber.category, inline: true },
                        { name: "Author:", value: `[@${vtuber.author}](https://github.com/${vtuber.author})`, inline: true },
                        { name: "Graduated:", value: vtuber.graduated, inline: true },
                        { name: "Is a Draft", value: vtuber.is_draft, inline: true },
                    )
                    .setTimestamp()
                    .setFooter({
                        text: "Powered by https://vtubers.wiki/sdk/node",
                        iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                    });

                const showLinkButton = new ButtonBuilder()
                    .setLabel("Show on vtubers.wiki")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://vtubers.wiki${vtuber.link}`)
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