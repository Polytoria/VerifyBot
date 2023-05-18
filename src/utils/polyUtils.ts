import axios from 'axios';

/**
 * polyUtils
 *
 * For sending Polytoria APIs
 *
 */
export default class polyUtils {
  /**
   * getUserInfoFromUsername Function
   *
   * @summary Get User info from specific Username
   *
   * @param {string} username User's username
   * @return {Promise<any>} User info
   */
  public static async getUserInfoFromUsername(username: string): Promise<any> {
    const response = await axios.get(`https://api.polytoria.com/v1/users/find?username=${username}`, {
      validateStatus: () => true,
    });

    const {data} = response;

    // Assuming the API response contains a "user" field, you can access it like this:
    const user = data.user;

    return user;
  }

  /**
   * getUserInfoFromID Function
   *
   * @summary Get User info from specific ID
   *
   * @param {number} id User ID
   * @return {Promise<any>} User info
   */
  public static async getUserInfoFromID(id: number): Promise<any> {
    const response = await axios.get('https://api.polytoria.com/v1/users/find?id=' + id, {
      validateStatus: () => true,
    });

    return response;
  }
}
