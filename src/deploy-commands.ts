import dotenv from 'dotenv';
import commandsData from './commandsData.js';
import {REST, Routes} from 'discord.js';

dotenv.config();

const rest = new REST().setToken(process.env.TOKEN!);

/**
 * Deploys commands to Discord.
 *
 * This function retrieves commands data, formats them, and deploys them using the Discord API.
 * It logs the number of commands deployed or any errors that occur during the deployment process.
 */
async function deploy() {
  try {
    console.log('Deploying commands');

    const commands: any = [];

    commandsData.forEach((commandData) => {
      commands.push({...commandData.data.toJSON(), integration_types: [0, 1], contexts: [0, 1, 2]});
    });

    const data: any = await rest.put(
        // @ts-expect-error
        Routes.applicationCommands(process.env.CLIENTID),
        {body: commands},
    );

    console.log(`Deployed ${data.length} commands`);
  } catch (error) {
    console.log('Failed deployment');
    console.error(error);
  }
}

deploy();
