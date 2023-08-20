import {GatewayIntentBits, Client, ActivityType} from 'discord.js';
import {config as configEnv} from 'dotenv';
import firebaseUtils from './utils/firebaseUtils.js';
import polyUtils from './utils/polyUtils.js';
import log from './utils/logUtils.js';
import {parse as parseCmd} from 'discord-command-parser';

import onUserJoined from './resources/events/onUserJoined.js';
import verifier from './resources/verify/verifier.js';

import commands from './export.js';

// Configurable Variables
const prefix = '!poly'; // Bot's Default prefix.

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

// On Message sent
client.on('messageCreate', async (message) => {
  console.log(message.content);
  // Parse the command
  const parsed = parseCmd(message, prefix, {allowSpaceBeforeCommand: true});
  console.log(parsed);

  if (parsed.success == true && parsed.command.toLowerCase() == 'verify') {
    commands['verify'](message, parsed.arguments);
    return;
  }

  if (message.guild === null) {
    verifier(message, [], client);
    return;
  }

  if (!parsed.success) return;

  // @ts-expect-error
  const targetFunction = commands[parsed.command.toLowerCase()];

  if (targetFunction) {
    targetFunction(message, parsed.arguments, client);
  }
});

client.on('ready', () => {
  log.logSuccess('Bot', 'Successfully Connected to Discord!');
  // @ts-expect-error
  client.user.setActivity(`${client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0)} Users | p!help`, { type: ActivityType.Watching })

  setInterval(function() {
    // @ts-expect-error
    client.user.setActivity(`${client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0)} Users | p!help`, { type: ActivityType.Watching })
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
