import {Guild} from 'discord.js';
import firebaseUtils from '../../utils/firebaseUtils.js';

/**
 * On User Joined function
 *
 * @param {Guild} guild Current guild
 */
export default async function(member: any, guild: Guild) {
  if (guild != null) {
    firebaseUtils.createSession(member.id, {forGuild: guild.id});
  }

  const messageEmbedContent =
    {
      title: 'Polytoria Account Verification process',
      description: `👋 Hello and Welcome to ${guild.name}! This server requires Polytoria Account Verification.\n\nTo get started, Paste this code to your Description:\n\`\`\`poly-verify-${member.id}\`\`\`\nAfter finished, Send me your username and you're ready to go!`,
      color: 0xfe3131,
      thumbnail: {
        url: 'https://i.imgur.com/fqvGOgW.png',
      },
      footer: {
        text: 'After you have been verified, You will not receive this message again.',
      },
    };

  if (member['user'] !== undefined) {
    console.log('is User');
    console.log(member.id);
    member.send({embeds: [messageEmbedContent]});
  } else {
    console.log('is Guild Member');
    member.user.send({embeds: [messageEmbedContent]});
  }
}
