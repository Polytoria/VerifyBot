import { GuildMember, Guild } from 'discord.js'

/**
 * On User Joined function
 */
export default async function (member: GuildMember, guild: Guild) {
  const messageEmbedContent =
    {
      title: 'Polytoria Account Verification process',
      description: `👋 Hello and Welcome to ${guild.name}! This server requires Polytoria Account Verification.\n\nTo get started, Paste this code to your Description:\n\`\`\`poly-verify-${member.id}\`\`\`\nAfter finished, Send me your username and you're ready to go!`,
      color: 0xfe3131,
      thumbnail: {
        url: 'https://i.imgur.com/fqvGOgW.png'
      },
      footer: {
        text: 'After you has been verified, You will not receive this message again.'
      }
    }

  member.user.send({ embeds: [messageEmbedContent] })
}
