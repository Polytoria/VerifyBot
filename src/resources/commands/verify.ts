import {CommandInteraction, PermissionsBitField} from 'discord.js';
import firebaseUtils from '../../utils/firebaseUtils.js';
import polyUtils from '../../utils/polyUtils.js';
import onUserJoined from '../events/onUserJoined.js';
import emojiUtils from '../../utils/emojiUtils.js';

/**
  * Command main function
  */
export const main = async function(interaction: CommandInteraction) {
  if (!interaction.inGuild()) {
    await interaction.reply(`${emojiUtils.error} **Error:** This command must be ran within a server.`);
    return;
  }
  if ((await interaction.guild?.members.fetchMe()) == null) {
    await interaction.reply(`${emojiUtils.error} **Error:** The bot is not inside of this server, and is unable to run the requested command. Please invite the bot and try again.`);
    return;
  }

  const isVerified = await firebaseUtils.isVerified(interaction.user.id);
  if (isVerified === true) {
    const verifiedRoleConfig = await firebaseUtils.getSpecificServerConfig(interaction.guildId, 'verifiedRole');

    const setNicknameConfig = await firebaseUtils.getSpecificServerConfig(interaction.guildId, 'setVerifiedNickname');

    if (verifiedRoleConfig) {
      // @ts-expect-error
      const role = interaction.guild.roles.cache.find((r) => r.id === verifiedRoleConfig);

      // @ts-expect-error
      interaction.member.roles.add(role);
    }
    if (setNicknameConfig == true) {
      const linkedUser = await firebaseUtils.getPolyUser(interaction.user.id);
      const polyUser = await polyUtils.getUserInfoFromID(linkedUser.PolytoriaUserID);

      // @ts-expect-error
      if ((await interaction.guild?.members.fetchMe()).permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        // @ts-expect-error
        interaction.member.setNickname(polyUser.username);
      } else {
        interaction.reply('Couldn\'t change your nickname, I lack the permission to!\n\nYour Polytoria account has already been verified. To unlink use `/unverify`');
        return;
      }
    }

    interaction.reply('Your Polytoria account has already been verified. To unlink use `/unverify`');
    return;
  }
  try {
    if (interaction.member == null) {
      // @ts-expect-error
      await onUserJoined(interaction.user, null);
      return;
    }
    // @ts-expect-error
    await onUserJoined(interaction.member, interaction.guild);
    await interaction.reply('I sent you a message in DMs!');
  } catch (err) {
    console.log(err);
    await interaction.reply('Couldn\'t send you a direct message! Please try again..');
  }
};
