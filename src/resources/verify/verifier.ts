import { Message, Client } from 'discord.js'
import firebaseUtils from '../../utils/firebaseUtils.js'
import polyUtils from '../../utils/polyUtils.js'

export default async function (message: Message, args: string[], client: Client) {
  const isUserVerified: boolean = await firebaseUtils.isVerified(message.author.id)
  if (isUserVerified === true) {
    return
  }

  const userInfo: any = await polyUtils.getUserInfoFromUsername(message.content)
  if (userInfo.status === 400) {
    message.author.send('User not found! Maybe you have made some typo, Try send me message again!')
  }
  if (userInfo.status.toString().startsWith('5')) {
    message.author.send("There's some issue going on with Polytoria API right now, Try again later.")
  }

  if (userInfo.data.Description.includes(`poly-verify-${message.author.id}`)) {
    await firebaseUtils.setVerified(message.author.id, userInfo.data.ID)

    const messageEmbedContent =
        {
          title: 'Verification Finished!',
          description: 'Your account has successfully been verified! 🥳',
          color: 0x66ff91,
          thumbnail: {
            url: `https://polytoria.com/assets/thumbnails/avatars/headshots/${userInfo.data.AvatarHash}.png`
          },
          footer: {
            text: 'Type `!poly verify` in your recently joined server to get verified role! (If setted)'
          }
        }

    message.author.send({ embeds: [messageEmbedContent] })
  } else {
    message.author.send('Wrong descrption provided, Make sure the code I sent were included!')
  }
}
