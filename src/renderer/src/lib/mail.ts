/**
 * 이메일 주소에 따른 메일 서비스 웹사이트 링크를 생성합니다.
 */
export function getMailLink(email: string): string {
  if (!email || !email.includes('@')) {
    return 'https://www.google.com'
  }

  const [, domainPart] = email.split('@')
  if (!domainPart) return 'https://www.google.com'

  const domainSegments = domainPart.split('.')
  const domain = domainSegments[0].toLowerCase()

  // 일반적인 무료 메일 서비스
  switch (domain) {
    case 'gmail':
      return 'https://mail.google.com'
    case 'naver':
      return 'https://mail.naver.com'
    case 'daum':
      return 'https://mail.daum.net'
    case 'kakao':
      return 'https://mail.kakao.com'
  }

  // 회사/기관 메일 및 기타 메일
  if (domainPart.includes('.')) {
    // 회사 메일 도메인 체크
    const tld = domainSegments[domainSegments.length - 1].toLowerCase()

    // Microsoft Exchange/Outlook 웹 접근 방식 시도
    if (['com', 'co', 'org', 'net', 'edu', 'gov', 'ac'].includes(tld)) {
      // 회사 메일은 대부분 Outlook Web Access나 Exchange를 사용하므로 해당 주소 패턴을 시도
      return `https://mail.${domainPart}`
    }
  }

  // 기본 검색 결과로 이동
  return `https://www.google.com/search?q=${encodeURIComponent(`${domainPart} webmail login`)}`
}
