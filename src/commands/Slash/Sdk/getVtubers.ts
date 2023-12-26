import { SlashCommandBuilder, Interaction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events, CommandInteraction } from 'discord.js';
import ISlashCommand from "../../../interfaces/ISlashCommand";
import Sdk from "vtuberwiki-sdk";


const sdk = Sdk.getInstance();



export const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("get-vtuber")
        .setDescription("Get info about a vtuber.")
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Phrase to search for')
                .setRequired(true)
                .setAutocomplete(true)),
    async autocomplete(interaction: Interaction) {

        const vtubers = await sdk.getVtubers();
        //@ts-ignore
        const focusedValue = interaction.options.getFocused();
        const choices = vtubers.map((choice: any) => choice.name);
        const filtered = choices.filter((choice: any) => choice.startsWith(focusedValue));
        //@ts-ignore
        await interaction.respond(
            filtered.map((choice: any) => ({ name: choice, value: choice.toLowerCase() })),
        );

    },

    async execute(interaction: CommandInteraction) {
        //@ts-ignore
        const query = interaction.options.getString('query');

        if (!query) return interaction.reply({ content: "Please provide a query!", ephemeral: true });

        const vtubers = await sdk.getVtubers();

        const vtuber = vtubers.find((vtuber: any) => vtuber.name.toLowerCase() === query.toLowerCase());

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

        const slug = vtuber.link.split('/').pop();

        const showLinkButton = new ButtonBuilder()
            .setLabel("Show on vtubers.wiki")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://vtubers.wiki${vtuber.link}`)
            .setEmoji("ℹ️");

        const editLinkButton = new ButtonBuilder()
            .setLabel(`Want to edit this entry?`)
            .setStyle(ButtonStyle.Link)
            .setURL(`https://github.com/vtuberwiki/wiki/blob/main/src/content/vtubers/${slug}.md`)
            .setEmoji("📝");

        const row = new ActionRowBuilder()
            .addComponents(showLinkButton, editLinkButton);

        //@ts-ignore
        await interaction.reply({ embeds: [embed], components: [row] });

        return;
    }
} as ISlashCommand;