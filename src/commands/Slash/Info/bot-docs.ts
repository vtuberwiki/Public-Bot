import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Interaction } from "discord.js";
import ISlashCommand from "../../../interfaces/ISlashCommand";
import { join } from "path";
import { readdir, stat as fsStat } from "fs/promises"; // Use promise-based functions
import { readFileSync } from 'fs';
import matter from "gray-matter";
const marked = require('marked');

const PATH = join(__dirname, "..", "..", "..", "..", "docs");

const SLUG_SEPARATOR = "::";
const PATH_SEPARATOR = "/";
const PATH_SEPARATOR_REGEX = new RegExp(SLUG_SEPARATOR, 'g');
const SKIP_LIST = ["README.md"];


const getDocs = async (dirPath: string, basePath: string, filter?: boolean): Promise<string[]> => {
    let filesList: string[] = [];

    try {
        const files = await readdir(dirPath);

        for (const file of files) {
            // Skip files in the SKIP_LIST
            if (SKIP_LIST.includes(file)) continue;

            const filePath = join(dirPath, file);
            const fileStat = await fsStat(filePath);

            if (fileStat.isDirectory()) {
                const subDirFiles = await getDocs(filePath, basePath, filter);
                filesList = filesList.concat(subDirFiles);
            } else {
                if (!filter || (filter && file.endsWith('.md'))) {
                    filesList.push(filePath.replace(basePath, ''));
                }
            }
        }
    } catch (error) {
        console.error("Error reading docs directory:", error);
    }

    return filesList;
};

const queryString = (query: string): string => {
    return query.replace(PATH_SEPARATOR_REGEX, PATH_SEPARATOR);
};

interface MatterData {
    content: string;
    data: {
        title?: string;
        description?: string;
    };
}


const matterData = (content: string): MatterData => {
    // It looks for a start ---, followed by any characters (non-greedy), ending with ---
    const frontMatterRegex = /^---[\s\S]*?---\n?/;


    return {
        content: content.replace(frontMatterRegex, ''),
        data: matter(content).data
    }
};


export const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("bot-docs")
        .setDescription("Get documentation for the bot.")
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Phrase to search for')
                .setRequired(true)
                .setAutocomplete(true)),
    async autocomplete(interaction: Interaction) {

        const docs = await getDocs(PATH, PATH, true).then(files =>
            files.map(file =>
                file.replace(/\.md$/, '') // Remove .md extension
                    .replace(/\\/g, SLUG_SEPARATOR)    // Replace backslashes with colons
                    .replace(/^::/, '')      // Remove leading colon if present
            )
        );
        //@ts-ignore
        const focusedValue = interaction.options.getFocused();
        const choices = docs.map((choice: any) => {
            const data = matter(readFileSync(join(PATH, queryString(choice) + '.md'), 'utf-8')).data;
            return {
                name: data.title,
                value: choice,
            }
        });
        const filtered = choices.filter((choice: any) => choice.name.startsWith(focusedValue));
        //@ts-ignore
        await interaction.respond(
            filtered.map((choice: any) => ({ name: choice.name, value: choice.value })),
        );

    },
    async execute(interaction: CommandInteraction) {

        //@ts-ignore
        const query = interaction.options.getString('query');

        // Read the file
        const filePath = join(PATH, `${queryString(query)}.md`);
        const file = await readFileSync(filePath, { encoding: 'utf-8' });
        

        const extractedData = matterData(file);

        // Create embed
        const embed = new EmbedBuilder()
            .setTitle(extractedData.data.title ?? 'Unkown Title')
            .setDescription(extractedData.content)
            .setTimestamp()
            .setFooter({
                text: "Powered by https://vtubers.wiki/sdk/node",
                iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
            })
            .setColor(0x0099FF);

        const editLinkButton = new ButtonBuilder()
            .setLabel(`Want to edit this?`)
            .setStyle(ButtonStyle.Link)
            .setURL(`https://github.com/vtuberwiki/Public-Bot/blob/main/docs/${queryString(query)}.md`)
            .setEmoji("📝");

        const row = new ActionRowBuilder()
            .addComponents(editLinkButton);


        //@ts-ignore
        await interaction.reply({ embeds: [embed], components: [row] });

    }
} as ISlashCommand;