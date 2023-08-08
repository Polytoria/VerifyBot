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

    // get id
    const data = response.data;
    const id = data.id;

    const id_response = await axios.get(`https://api.polytoria.com/v1/users/${id}`, {
      validateStatus: () => true,
    });

    const user_data = id_response.data;

    return user_data;
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
    const response = await axios.get(`https://api.polytoria.com/v1/users/${id}`, {
      validateStatus: () => true,
    });

    const user_data = response.data;

    return user_data;
  }
}
