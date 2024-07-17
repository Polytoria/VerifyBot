import {CommandInteraction} from 'discord.js';
import firebaseUtils from '../../utils/firebaseUtils.js';

/**
  * Command main function
  */
export const main = async function(interaction: CommandInteraction) {
  if (!interaction.inGuild()) {
    await interaction.reply('You must run this command in a server!');
    return;
  }

  if ((await interaction.guild?.members.fetchMe()) == null) {
    await interaction.reply('I need to have joined the server in which you are running the command in!');
    return;
  }

  // @ts-expect-error
  if (interaction.member?.permissions.has('Administrator') == false) {
    await interaction.reply('Permission Declined');
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
      await interaction.reply('🎉 Succesfully Binded Verified role!');
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
    await interaction.reply('🎉 Succesfully Binded Nickname to ' + boolean + '!');
  }
};
