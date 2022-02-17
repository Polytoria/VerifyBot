import { Message } from 'discord.js'
import firebaseUtils from '../../utils/firebaseUtils.js'
import polyUtils from '../../utils/polyUtils.js'
import onUserJoined from '../events/onUserJoined.js'

/**
 * Command Name
 */
export const name = 'verify'

/**
  * Command Description
  */
export const description = 'Get your Discord account verified!'

/**
  * Command main function
  */
export const main = async function (message: Message, args: string[]) {
  const isVerified = await firebaseUtils.isVerified(message.author.id)
  if (isVerified === true) {
    // @ts-expect-error
    const verifiedRoleConfig = await firebaseUtils.getSpecificServerConfig(message.guild.id, 'verifiedRole')

    // @ts-expect-error
    const setNicknameConfig = await firebaseUtils.getSpecificServerConfig(message.guild.id, 'setVerifiedNickname')

    if (verifiedRoleConfig) {
      // @ts-expect-error
      const role = message.guild.roles.cache.find(r => r.id === verifiedRoleConfig)

      // @ts-expect-error
      message.member.roles.add(role)      
    }
    if (setNicknameConfig == true) {
      const linkedUser = await firebaseUtils.getPolyUser(message.author.id)
      const polyUser = await polyUtils.getUserInfoFromID(linkedUser.PolytoriaUserID)

      //@ts-expect-error
      message.member.setNickname(polyUser.data.Username);
    }
    message.channel.send('Your Polytoria account has already been verified. To unlink use `!poly unverify`')
    return
  }
  try {
    await message.author.send("Gettin' things done...")
    // @ts-expect-error
    await onUserJoined(message.member, message.guild)
  } catch {
    message.channel.send("Couldn't send you a direct message! Please try again..")
  }
}
