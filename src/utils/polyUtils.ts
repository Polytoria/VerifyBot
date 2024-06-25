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
    const response = await axios.get(`https://api.polytoria.co/v1/users/find?username=${username}`, {
      validateStatus: () => true,
    });

    // get id
    const data = response.data;
    const id = data.id;

    const idResponse = await axios.get(`https://api.polytoria.co/v1/users/${id}`, {
      validateStatus: () => true,
    });

    const userData = idResponse.data;

    return userData;
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
    const response = await axios.get(`https://api.polytoria.co/v1/users/${id}`, {
      validateStatus: () => true,
    });

    const userData = response.data;

    return userData;
  }
}
