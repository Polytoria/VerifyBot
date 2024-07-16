import {GatewayIntentBits, Client, ActivityType, Collection, Events, BaseInteraction} from 'discord.js';
import {config as configEnv} from 'dotenv';
import firebaseUtils from './utils/firebaseUtils.js';
import polyUtils from './utils/polyUtils.js';
import log from './utils/logUtils.js';
import commandsData from './commandsData.js';

import onUserJoined from './resources/events/onUserJoined.js';
import verifier from './resources/verify/verifier.js';

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// Configurate ENV files
configEnv();

// Connect Application to Firebase
firebaseUtils.init();

// @ts-expect-error
client.commands = new Collection();

commandsData.forEach((commandData, index) => {
  // @ts-expect-error
  client.commands.set(commandData.data.name, commandData);
});

// On Message sent
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!poly') && message.inGuild()) {
    await message.reply('The Polytoria Community Verify Bot has switched to slash commands!');
    return;
  }
  verifier(message, [], client);
});


client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
  if (!interaction.isCommand()) {
    return;
  }

  // @ts-expect-error
  const command: any = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    interaction.reply('Command doesn\'t exist');
  }

  try {
    if (command.constructor.name === 'AsyncFunction') {
      await command.execute(interaction);
    } else {
      command.execute(interaction);
    }
  } catch (error: any) {
    if (interaction.replied) {
      await interaction.followUp('Failed to execute command: ' + error);
    } else {
      await interaction.reply('Failed to execute command: ' + error);
    }
    log.logError('Bot', error.toString());
  }
});

client.on('ready', () => {
  log.logSuccess('Bot', 'Successfully Connected to Discord!');
  // @ts-expect-error
  client.user.setActivity(`${client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0)} Users | /verify`, {type: ActivityType.Watching});

  setInterval(function() {
    // @ts-expect-error
    client.user.setActivity(`${client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0)} Users | /verify`, {type: ActivityType.Watching});
  }, 60000);
});

// Handle Errors without crashing process
process.on('unhandledRejection', (reason, p) => {
  console.log(p);
});

process.on('uncaughtException', (err) => {
  console.log(err, 'Uncaught Exception thrown');
});

client.on('guildMemberAdd', async (member) => {
  const isVerified = await firebaseUtils.isVerified(member.id);
  if (isVerified === true) {
    const verifiedRoleConfig = await firebaseUtils.getSpecificServerConfig(member.guild.id, 'verifiedRole');

    const setNicknameConfig = await firebaseUtils.getSpecificServerConfig(member.guild.id, 'setVerifiedNickname');

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
    return;
  }
  onUserJoined(member, member.guild);
});

log.logNormal('Bot', 'Loggin in...');
client.login(process.env.TOKEN);
