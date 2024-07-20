import {CommandInteraction} from 'discord.js';
import firebaseUtils from '../../utils/firebaseUtils.js';
import emojiUtils from '../../utils/emojiUtils.js';
/**
  * Command main function
  */
export const main = async function(interaction: CommandInteraction, args: string[]) {
  if (!interaction.inGuild()) {
    await interaction.reply(`${emojiUtils.error} **Error:** This command must be ran within a server.`);
    return;
  }
  if ((await interaction.guild?.members.fetchMe()) == null) {
    await interaction.reply(`${emojiUtils.error} **Error:** The bot is not inside of this server, and is unable to run the requested command. Please invite the bot and try again.`);
    return;
  }

  const isVerified = await firebaseUtils.isVerified(interaction.user.id);
  if (isVerified === false) {
    await interaction.reply('Your Polytoria account hasn\'t been verified yet. To verify use `/verify`');
    return;
  }
  await firebaseUtils.unLinkAccount(interaction.user.id);
  await interaction.reply('Your Polytoria account has been unlinked.');

  // @ts-expect-error
  const verifiedRoleConfig = await firebaseUtils.getSpecificServerConfig(interaction.guild.id, 'verifiedRole');
  if (verifiedRoleConfig) {
    // @ts-expect-error
    const role = interaction.guild.roles.cache.find((r) => r.id === verifiedRoleConfig);

    // @ts-expect-error
    interaction.member.roles.remove(role);

    return;
  }
};
