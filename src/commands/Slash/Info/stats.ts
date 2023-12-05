import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import ISlashCommand from "../../../interfaces/ISlashCommand";
import Sdk from "vtuberwiki-sdk";
import axios from "axios";
import IClient from "../../../interfaces/IClient";
import { fNumber } from "developer-toolkit-utils";
import config from "../../../config";

type StatsData = {
    [key: string]: any;
};

export const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Get stats about the bot."),
    async execute(interaction: CommandInteraction) {

        const discordData: StatsData = {
            Guilds: fNumber(interaction.client.guilds.cache.size),
            Users: fNumber(interaction.client.users.cache.filter((user) => !user.bot).size),
            Channels: fNumber(interaction.client.channels.cache.size),
            Commands: fNumber((interaction.client as IClient).commands.size),
            Uptime: interaction.client.uptime,
            Emojis: fNumber(interaction.client.emojis.cache.size),
        };

        let webData: StatsData = {};
        let wikiData: StatsData = {};

        const sdk = Sdk.getInstance();

        try {
            const web = await axios.get("https://vtubers.wiki");

            webData = {
                Status: web.status,
                Status_Text: web.statusText,
                Http_Version: web.request.res.httpVersion,
                Server: web.headers.server,
            };

            wikiData = {
                Vtubers: fNumber((await sdk.getVtubers()).length),
                Software: fNumber((await sdk.getSoftware()).length),
                Guides: fNumber((await sdk.getGuides()).length),
                Change_Logs: fNumber((await sdk.getChangeLogs()).length),
                Blog_Posts: fNumber((await sdk.getBlogs()).length),
                Authors: fNumber((await sdk.getAuthors()).length),
                Topics: fNumber((await sdk.getTopics()).length),
            }

            const WebEmbed = new EmbedBuilder()
                .setTitle("Web")
                .setDescription("Stats about the web.")
                .setTimestamp()
                .setFooter({
                    text: "Powered by https://vtubers.wiki/sdk/node",
                    iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                });

            const WikiEmbed = new EmbedBuilder()
                .setTitle("Wiki")
                .setDescription("Stats about the wiki.")
                .setTimestamp()
                .setFooter({
                    text: "Powered by https://vtubers.wiki/sdk/node",
                    iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                });

            const DiscordEmbed = new EmbedBuilder()
                .setTitle("Discord")
                .setDescription("Stats about the discord bot.")
                .setTimestamp()
                .setFooter({
                    text: "Powered by https://vtubers.wiki/sdk/node",
                    iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
                });


            Object.keys(webData).forEach((key: string) => {
                WebEmbed.addFields({
                    name: key.replace(/_/g, " "),
                    value: webData[key].toString(),
                    inline: true,
                });
            });

            Object.keys(wikiData).forEach((key: string) => {
                WikiEmbed.addFields({
                    name: key.replace(/_/g, " "),
                    value: wikiData[key].toString(),
                    inline: true,
                });
            });

            Object.keys(discordData).forEach((key: string) => {
                DiscordEmbed.addFields({
                    name: key.replace(/_/g, " "),
                    value: discordData[key].toString(),
                    inline: true,
                });
            });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("View on GitHub")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://github.com/vtuberwiki/Public-Bot")
                        .setEmoji(config.Emojis.Github)
                );

            //@ts-ignore
            await interaction.reply({ embeds: [WebEmbed, WikiEmbed, DiscordEmbed], components: [row] });

        } catch (error) {
            console.error(error);
        }
    },
} as ISlashCommand;