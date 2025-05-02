import { shell } from 'electron'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type OpenExternalUrlParams } from '@/interface/CoreInterface'

/**
 * 시스템 기본 브라우저로 URL을 여는 핸들러
 * @extends CoreBaseHandler
 */
export class OpenExternalUrlHandler extends CoreBaseHandler<IpcChannel.SYSTEM_OPEN_EXTERNAL_URL> {
  constructor() {
    super(IpcChannel.SYSTEM_OPEN_EXTERNAL_URL)
  }

  private readonly urlMapper = {
    'mail.gmail.com': 'https://mail.google.com/mail/u',
    'mail.naver.com': 'https://mail.naver.com/v2',
    'mail.daum.net': 'https://mail.daum.net/top/INBOX'
  }

  /**
   * URL을 시스템 기본 브라우저에서 엽니다
   * @param {OpenExternalUrlParams} params - { url: string }
   */
  async handler(params: OpenExternalUrlParams) {
    let error: (Error & { code: number }) | null = Object.assign(new Error('test'), { code: 10 })

    try {
      await shell.openExternal(this.urlMapper[params.url] ?? params.url)
    } catch (error) {
      error = error as Error
    }

    return { data: null, error }
  }
}
