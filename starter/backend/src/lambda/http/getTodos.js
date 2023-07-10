import { todoModel } from '../../model/todo.js'
import { getUserId } from '../auth/jwt.js'

export async function handler(event) {
  // TODO: Get all TODO items for a current user
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(
      { items: await todoModel.getAll(getUserId(event)) },
      null,
      2
    )
  }
}
