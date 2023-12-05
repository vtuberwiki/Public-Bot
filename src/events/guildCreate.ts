import { Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType } from "discord.js";
import IClient from "../interfaces/IClient";

module.exports = {
    name: Events.GuildCreate,
    once: false,
    async execute(guild: any, client: IClient) {

        const embed = new EmbedBuilder()
            .setColor("#55CDFC")
            .setTitle("Thanks for adding me!")
            .setDescription(`Thanks for adding me to your server! My prefix is \`/\``)
            .addFields(
                { name: "Support Server", value: "https://discord.gg/4KdkmYwV" },
                { name: "Invite Link", value: `[Click Here](https://discord.com/oauth2/authorize?client_id=${client.user?.id}&scope=bot%20applications.commands&permissions=8)` },
            )
            .setFooter({
                text: "Powered by https://vtubers.wiki/sdk/node",
                iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
            })

        const supporting = new EmbedBuilder()
            .setColor("#55CDFC")
            .setTitle("Our Mission to Supporting Transgender and Queer Communities")
            .setDescription(`In the face of numerous cases of fatal violence targeting transgender and queer communities, our unwavering mission is to stand as allies for the LGBTQ+ community. The visionary mind behind the Vtuber Wiki, [@withervt](https://twitter.com/withervt), is a proud Trans Woman herself.

            We commit 60% of our donations to support impactful charities such as:
            
            The Attic Youth Center
            Sage
            OutRight Action International
            Lambda Literary
            
            And many more!
            
            If you share our commitment to creating a safer and more inclusive world, we invite you to contribute. Click the button below to make a donation and join us in fostering positive change!`)
            .setFooter({
                text: "Powered by https://vtubers.wiki/sdk/node",
                iconURL: "https://pbs.twimg.com/profile_images/1713923311858593792/doH2HOXp_400x400.png"
            })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Donate")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://vtubers.wiki/donate")
                    .setEmoji("<:5766transgendersparkleheart:1181343771842072698>")
            );

        const channel = await guild.channels.fetch(guild.systemChannelId as string);

        if (channel && channel.type === ChannelType.GuildText && channel.permissionsFor(guild.client.user!)?.has("SEND_MESSAGES")) {
            channel.send({ embeds: [embed, supporting], components: [row] });
        } else {

            const guildChannels = guild.channels.cache.filter((channel: any) => channel.type === ChannelType.GuildText);

            const firstChannel = guildChannels.first();

            if (!firstChannel) return;

            
            const channel = await firstChannel.send({ embeds: [embed, supporting], components: [row] });

            if (channel && channel.type === ChannelType.GuildText && channel.permissionsFor(guild.client.user!)?.has("SEND_MESSAGES")) {
                channel.send({ embeds: [embed, supporting], components: [row] });
            } else {
                return;
            }

        }


    }
}