import {BaseInteraction, CommandInteraction, Message} from 'discord.js';
import firebaseUtils from '../../utils/firebaseUtils.js';
import polyUtils from '../../utils/polyUtils.js';
import onUserJoined from '../events/onUserJoined.js';

/**
  * Command main function
  */
export const main = async function(interaction: CommandInteraction) {
  if(!interaction.inGuild()){
    await interaction.reply("You must run this command in a server!")
    return
  }
  
  const isVerified = await firebaseUtils.isVerified(interaction.user.id);
  if (isVerified === true) {
    const verifiedRoleConfig = await firebaseUtils.getSpecificServerConfig(interaction.guildId, 'verifiedRole');

    const setNicknameConfig = await firebaseUtils.getSpecificServerConfig(interaction.guildId, 'setVerifiedNickname');

    if (verifiedRoleConfig) {
      // @ts-expect-error
      const role = interaction.guild.roles.cache.find((r) => r.id === verifiedRoleConfig);

      // @ts-expect-error
      interaction.member.roles.add(role)
    }
    if (setNicknameConfig == true) {
      const linkedUser = await firebaseUtils.getPolyUser(interaction.user.id);
      const polyUser = await polyUtils.getUserInfoFromID(linkedUser.PolytoriaUserID);

      // @ts-expect-error
      interaction.member.setNickname(polyUser.username);

    }

    // @ts-expect-error
    interaction.channel.send('Your Polytoria account has already been verified. To unlink use `/unverify`');
    return;
  }
  try {
    if (interaction.member == null) {
      // @ts-expect-error
      await onUserJoined(interaction.user, null);
      await interaction.reply("I sent you a message in DMs!")
      return;
    }
    // @ts-expect-error
    await onUserJoined(interaction.member, interaction.guild);
  } catch (err) {
    console.log(err);
    await interaction.reply('Couldn\'t send you a direct message! Please try again..');
  }
};
