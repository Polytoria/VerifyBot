import axios from 'axios'

export default class polyUtils {
  public static async getUserInfoFromUsername (username: string): Promise<any> {
    const response = await axios.get('https://api.polytoria.com/v1/users/getbyusername?username=' + username, {
      validateStatus: () => true
    })

    return response
  }

  public static async getUserInfoFromID (id: string): Promise<any> {
    const response = await axios.get('https://api.polytoria.com/v1/users/user?id=' + id, {
      validateStatus: () => true
    })

    return response
  }
}
