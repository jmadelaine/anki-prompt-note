/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { is, isArrayOf, isNull, isUndefined } from 'ts-guardian'

// Used to replace 'null' with 'undefined' in API responses so that Mayo doesn't need to deal with 'null'
export const nullToUndefined = (v: any): any => {
  if (isNull(v)) return undefined

  if (isArrayOf('any')(v)) {
    return v.map(nullToUndefined) as any
  }
  if (is({})(v)) {
    return Object.keys(v).reduce((res, k) => {
      ;(res as any)[k] = nullToUndefined((v as any)[k])
      return res
    }, {})
  }
  return v
}

// Used to replace 'undefined' with 'null' in API requests as Mayo treats everything as 'undefined'
export const undefinedToNull = (v: any): any => {
  if (isUndefined(v)) return null

  if (isArrayOf('any')(v)) {
    return v.map(undefinedToNull) as any
  }
  if (is({})(v)) {
    return Object.keys(v).reduce((res, k) => {
      ;(res as any)[k] = undefinedToNull((v as any)[k])
      return res
    }, {})
  }
  return v
}
