import { CommonConstant } from '@constants/CommonConstant'

type Param = string | number | object | typeof Array | undefined | null

/**
 * isEmpty
 * @desc 인자값이 비었는지 검사 (falsy check)
 */
export function isEmpty(param: Param): boolean {
  if (param === null || param === undefined) {
    return true
  }

  if (typeof param === 'string') {
    return param.length === 0
  }

  if (typeof param === 'number') {
    return param === 0
  }

  if (Array.isArray(param)) {
    return param.length === 0
  }

  if (typeof param === 'object') {
    return Object.keys(param).length === 0
  }

  return false
}

/**
 * isNotEmpty
 * @desc isEmpty의 반대 값을 반환 (truthy check)
 */
export function isNotEmpty(param: Param): boolean {
  return !isEmpty(param)
}

/**
 * getEmptyString
 * @param length 생성할 배열의 길이
 */
export function getEmptyArray(length: number) {
  return Array(length).fill(CommonConstant.EMPTY_STRING) as string[]
}

/**
 * getFileExtension
 * @param filePath 파일 경로
 * @returns 파일 확장자
 */
export function getFileExtension(filePath: string) {
  return filePath.split('.').pop()
}

/**
 * getPublicAccessUrl
 * @param Supabase Storage 중 공개된 파일 경로
 * @returns 파일 공개 접근 URL
 */
export function getPublicAccessUrl(filePath: string) {
  return `${import.meta.env.VITE_SUPABASE_PROJECT_URL}/storage/v1/object/public/${CommonConstant.BUCKET_NAME}/${filePath}`
}
