export class CommonConstant {
  /**
   * EMPTY_STRING
   * @desc 빈 문자열
   */
  static EMPTY_STRING = ''

  /**
   * URL
   * @desc URL 관련 상수
   */
  static URL = {
    MAIL_PREFIX: 'https://mail.'
  }

  /**
   * TYPE
   * @desc 각 Type들에 해당하는 문자열 상수
   */
  static TYPE = {
    MAIL: 'email' as const
  }
}
