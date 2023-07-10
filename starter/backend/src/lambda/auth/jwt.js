import { decode } from 'jsonwebtoken'
export function parseUserId(jwtToken) {
  const decodedJwt = decode(jwtToken)
  return decodedJwt.sub
}

export function getUserId(event) {
  const authorization =
    event.headers.authorization || event.headers.Authorization
  console.log('authorizationToken', event.headers)
  //   console.log('event.headers', event.headers)
  if (!authorization) throw new Error('No authorization header')
  const split = authorization.split(' ')
  const jwtToken = split[1]
  console.log('AAA', jwtToken)
  return parseUserId(jwtToken)
}
