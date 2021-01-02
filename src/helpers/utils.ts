export class Utils {
  /** convert returned string object from sql result to array of objects */
  public static formatStringObjectsToArrayObjects = (result: any, type: string) => {
    if (result[type]) {
      result[type] = JSON.parse(result[type]);
    } else {
      result[type] = [];
    }
    return result[type];
  };
}
