import axios from 'axios'
import { nullToUndefined, undefinedToNull } from './utils'

export const doRequest = async ({
  url,
  params,
  payload,
  method,
}: {
  url: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  params?: Record<string, unknown>
  payload?: Record<string, unknown> | Record<string, unknown>[] | FormData
}) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return nullToUndefined(
    (
      await axios({
        url,
        method,
        params: params ? undefinedToNull(params) : undefined,
        // FormData used to upload files, so don't use undefinedToNull in that case
        data: payload ? (payload instanceof FormData ? payload : undefinedToNull(payload)) : undefined,
        // TODO: pass access token
        // headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })
    ).data
  ) as unknown
}
