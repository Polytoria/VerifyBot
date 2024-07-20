import {CommandInteraction} from 'discord.js';
import firebaseUtils from '../../utils/firebaseUtils.js';
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

  // @ts-expect-error
  if (interaction.member?.permissions.has('Administrator') == false) {
    await interaction.reply(`${emojiUtils.error} **Error:** You do not have permissions to run this command. Please contact someone with the Administrator permission.`);
    return;
  }

  // @ts-expect-error
  const configToModify = interaction.options.getSubcommand();

  if (configToModify == 'verifiedrole') {
    // @ts-expect-error
    const role = interaction.options.getRole('role');
    if (role == null) {
      return await interaction.reply('No role was specified');
    } else {
      firebaseUtils.configServer(
          // @ts-expect-error
          interaction.guild.id,
          'verifiedRole',
          // @ts-expect-error
          interaction.options.getRole('role').id,
      );
      await interaction.reply(`${emojiUtils.checkmark} **Success!** The role you have selected has been binded and will be given to users after they verify.`);
    }
  } else if (configToModify == 'setverifiednickname') {
    // @ts-expect-error
    const boolean = interaction.options.getBoolean('setverifiednickname');
    firebaseUtils.configServer(
        // @ts-expect-error
        interaction.guild.id,
        'setVerifiedNickname',
        boolean,
    );
    await interaction.reply(`${emojiUtils.checkmark} **Success!** The configuration for binded nickname has been set to ` + boolean + '.');
  }
};
