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
    const response = await fetch(`https://api.polytoria.com/v1/users/find?username=${username}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user info for username: ${username}`);
    }

    const data = await response.json();
    const id = data.id;

    const idResponse = await fetch(`https://api.polytoria.com/v1/users/${id}`);

    if (!idResponse.ok) {
      throw new Error(`Failed to fetch user info for ID: ${id}`);
    }

    const userData = await idResponse.json();

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
    const response = await fetch(`https://api.polytoria.com/v1/users/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user info for ID: ${id}`);
    }

    const userData = await response.json();

    return userData;
  }
}
