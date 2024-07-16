import {CommandInteraction, Message} from 'discord.js';
import firebaseUtils from '../../utils/firebaseUtils.js';

/**
  * Command main function
  */
export const main = async function(interaction: CommandInteraction) {
  if(!interaction.inGuild()){
    await interaction.reply("You must run this command in a server!")
    return
  }
  // @ts-expect-error
  if (interaction.member?.permissions.has('Administrator') == false) {
    await interaction.reply('Permission Declined');
    return;
  }

  //@ts-expect-error
  const configToModify = interaction.options.getSubcommand()

  if (configToModify == null) {
    const messageEmbedContent =
        {
          title: 'Bind command',
          description: 'It looks like you\'re using wrong format! Here\'s tutorial on how it works!\n```/bind [config_name] [value]```\n**Available Settings**\n\n`verifiedRole` Set the role that will be given to verified users. Value should be a role\n`setVerifiedNickname` Set is the bot should set the verified user\'s nickname or not',
          color: 0x66ff91,
        };

    return await interaction.reply({embeds: [messageEmbedContent]});
  }

  if(configToModify == "verifiedrole"){
    // @ts-expect-error
    const role = interaction.options.getRole("role")
    if(role == null){
      return await interaction.reply("No role was specified")
    } else {
      firebaseUtils.configServer(
        // @ts-expect-error
        interaction.guild.id,
        "verifiedRole",
        // @ts-expect-error
        interaction.options.getRole("role").id,
    );
    await interaction.reply('🎉 Succesfully Binded Verified role!');
    }
  } else if(configToModify == "setverifiednickname"){
    // @ts-expect-error
    const boolean = interaction.options.getBoolean("setverifiednickname")
    firebaseUtils.configServer(
      // @ts-expect-error
      interaction.guild.id,
      "setVerifiedNickname",
      boolean,
    );
    await interaction.reply('🎉 Succesfully Binded Nickname to ' + boolean + '!');
  }
};
