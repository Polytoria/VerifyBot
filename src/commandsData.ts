import { SlashCommandBuilder } from "discord.js";
import {main as verify} from './resources/commands/verify.js';
import {main as unverify} from './resources/commands/unverify.js';
import {main as bind} from './resources/commands/bind.js';

export default [
    {
        data: new SlashCommandBuilder()
            .setName("verify")
            .setDescription("Get your Discord account verified!"),
        execute: verify
    },
    {
        data: new SlashCommandBuilder()
            .setName("unverify")
            .setDescription("Unlink your Polytoria account with discord."),
        execute: unverify
    },
    {
        data: new SlashCommandBuilder()
            .setName("bind")
            .setDescription("Configure the bot (available to server admins only")
            .addSubcommand(subCommand => subCommand
                .setName("verifiedrole")
                .setDescription("Set the role to be handed out for verified users")
                .addRoleOption(option => option.setName("role").setDescription("The role to hand out to verified users").setRequired(true))
            )
            .addSubcommand(subCommand => subCommand
                .setName("setverifiednickname")
                .setDescription("Whether or not to set verified users' nickname to their Polytoria username.")
                .addBooleanOption(option => option.setName("setverifiednickname").setDescription("Whether or not to set verified users' nickname to their Polytoria username.").setRequired(true))
            ),
        execute: bind
    }
]