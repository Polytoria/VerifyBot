import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import log from './logUtils.js'
import fs from 'fs/promises'

let fireStore: Firestore = new Firestore()

export default class firebaseUtils {
  /**
     * Init Function
     *
     * @summary Connect Application with firebase
     *
     * @example
     * import { init } from 'firebaseUtils.ts'
     *
     * init()
     */
  public static async init (): Promise<void> {
    const data: string = await fs.readFile('serviceAccountKey.json', 'utf-8')
    initializeApp({
      credential: cert(JSON.parse(data))
    })
    log.logSuccess('Firebase', 'Successfully Connected to firebase!')
    fireStore = getFirestore()
  }

  /**
   * isVerified Function
   *
   * @summary Check if the Discord User has linked with Polytoria Community Verify
   *
   * @param { string } discordUserID Targetted user ID
   * @returns { Promise<Boolean> } Is user verified
   */
   public static async isVerified (discordUserID: string): Promise<boolean> {
    const usersRef = fireStore.collection('Users').doc(discordUserID)
    const doc = await usersRef.get()
    if (!doc.exists) {
      return false
    } else {
      return true
    }
  }

    /**
   * getPolyUser Function
   *
   * @summary Get the Discord User has linked with Polytoria Community Verify
   *
   * @param { string } discordUserID Targetted user ID
   * @returns { Promise<Boolean> } Is user verified
   */
     public static async getPolyUser (discordUserID: string): Promise<any> {
      const usersRef = fireStore.collection('Users').doc(discordUserID)
      const doc = await usersRef.get()
      return doc.data()
    }

  /**
   * setVerified Function
   *
   * @summary Set User Verify state to Verified
   *
   * @param { string } discordUserID Targetted user ID
   * @param { string } polyUserID Targetted polytoria user ID
   */
  public static async setVerified (discordUserID: string, polyUserID: string): Promise<void> {
    const usersRef = fireStore.collection('Users').doc(discordUserID)
    await usersRef.set({
      DiscordUserID: discordUserID,
      PolytoriaUserID: polyUserID
    })
  }

  /**
   * unLinkAccount Function
   *
   * @summary Unlink targetted Discord user id from Polytoria Account
   *
   * @param { string } discordUserID Targetted user ID
   */
  public static async unLinkAccount (discordUserID: string): Promise<void> {
    const usersRef = fireStore.collection('Users').doc(discordUserID)
    await usersRef.delete()
  }

  /**
   * configServer Function
   *
   * @summary Set guild Configuration
   *
   * @param { string } guildID Targetted Guild ID
   * @param { string } keyName KeyName of Config
   * @param { any } valueData Value Data of Config
   */
  public static async configServer (guildID: string, keyName: string, valueData: any): Promise<void> {
    const guildRef = fireStore.collection('Configuration').doc(guildID)
    try {
      await guildRef.update({
        [keyName]: valueData
      })
    } catch {
      await guildRef.set({})

      await guildRef.update({
        [keyName]: valueData
      })
    }
  }

  /**
   * getServerConfig Function
   *
   * @summary Get all server configuration
   *
   * @param { string } guildID Targetted Guild ID
   * @returns { Promise<any> } Result data
   */
   public static async getServerConfig (guildID: string): Promise<any> {
    const guildRef = fireStore.collection('Configuration').doc(guildID)
    const doc = await guildRef.get()
    if (!doc.exists) {
      return false
    } else {
      return doc.data()
    }
  }

  /**
   * getSpecificServerConfig Function
   *
   * @summary Get Specific server config from key
   *
   * @param { string } guildID Targetted Guild ID
   * @param { string } keyName Config KeyName
   * @returns { Promise<any> } Result Data
   */
  public static async getSpecificServerConfig (guildID: string, keyName: string): Promise<any> {
    const guildData: any = await firebaseUtils.getServerConfig(guildID)
    return guildData[keyName]
  }
}
