import chalk from 'chalk'

/**
 * log Class
 * Class for logging messages to the console
 */
export default class log {
/**
 * logError
 * @summary Log formatted error message to the console.
 * @param {string} from Author of the log
 * @param {string} text Message Content
 */
  public static logError (from: string, text: string): void {
    console.log(chalk.red(`❌ [${from}] ${text}`))
  }

  /**
   * logSuccess
   * @summary Log formatted success message to the console.
   * @param {string} from Author of the log
   * @param {string} text Message Content
   */
  public static logSuccess (from: string, text: string): void {
    console.log(chalk.green(`✅ [${from}] ${text}`))
  }

  /**
   * logWarning
   * @summary Log formatted warning message to the console.
   * @param {string} from Author of the log
   * @param {string} text Message Content
   */
  public static logWarning (from: string, text: string): void {
    console.log(chalk.yellow(` • [${from}] ${text}`))
  }

  /**
   * logNormal
   * @summary Log formatted message to the console.
   * @param {string} from Author of the log
   * @param {string} text Message Content
   */
  public static logNormal (from: string, text: string): void {
    console.log(chalk.blue(` • [${from}] ${text}`))
  }
}
