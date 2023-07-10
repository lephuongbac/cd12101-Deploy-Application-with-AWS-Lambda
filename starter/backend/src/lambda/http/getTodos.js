import { todoModel } from '../../model/todo.js'

export async function handler(event) {
  // TODO: Get all TODO items for a current user
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(await todoModel.getAll(), null, 2)
  }
}
