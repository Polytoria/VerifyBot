import {Client, Guild, GuildMember, Message} from 'discord.js';
import firebaseUtils from '../../utils/firebaseUtils.js';
import polyUtils from '../../utils/polyUtils.js';

/**
 * Verifier
 *
 * @summary For verifying current user
 *
 * @param {Message} message Discord message
 */
export default async function(message: Message, args: string[], client: Client) {
  const isUserVerified: boolean = await firebaseUtils.isVerified(message.author.id);
  if (isUserVerified === true) {
    return;
  }

  const userInfo: any = await polyUtils.getUserInfoFromUsername(message.content);

  if (userInfo.description.includes(`poly-verify-${message.author.id}`)) {
    await firebaseUtils.setVerified(message.author.id, userInfo.id);

    const messageEmbedContent =
        {
          title: 'Verification Finished!',
          description: 'Your account has successfully been verified! 🥳',
          color: 0x66ff91,
          thumbnail: {
            url: `${userInfo.avatarUrl}`,
          },
          footer: {
            text: 'Type `!poly verify` in your recently joined server to get verified role! (If setted)',
          },
        };

    message.author.send({embeds: [messageEmbedContent]});

    const sessionData = await firebaseUtils.readSession(message.author.id);

    console.log(sessionData);

    const verifiedRoleConfig = await firebaseUtils.getSpecificServerConfig(sessionData.forGuild, 'verifiedRole');

    const setNicknameConfig = await firebaseUtils.getSpecificServerConfig(sessionData.forGuild, 'setVerifiedNickname');

    // @ts-expect-error
    const guild: Guild = client.guilds.cache.find((r) => r.id === sessionData.forGuild);
    // @ts-expect-error
    const member: GuildMember = guild.members.cache.find((r) => r.id === message.author.id);

    if (verifiedRoleConfig) {
      const role = member.guild.roles.cache.find((r) => r.id === verifiedRoleConfig);

      // @ts-expect-error
      member.roles.add(role);
    }
    if (setNicknameConfig == true) {
      const linkedUser = await firebaseUtils.getPolyUser(member.id);
      const polyUser = await polyUtils.getUserInfoFromID(linkedUser.PolytoriaUserID);

      member.setNickname(polyUser.username);
    }

    firebaseUtils.deleteSession(message.author.id);
  } else {
    message.author.send('Wrong descrption provided, Make sure the code I sent were included!');
  }
}
