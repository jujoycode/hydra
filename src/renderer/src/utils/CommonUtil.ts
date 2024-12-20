type Param = string | number | object | typeof Array | undefined | null

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

export function isNotEmpty(param: Param): boolean {
  return !isEmpty(param)
}
