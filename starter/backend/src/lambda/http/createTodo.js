import { todoModel } from '../../model/todo.js'
import { getUserId } from '../auth/jwt.js'

export async function handler(event, context, callback) {
  const newTodo = JSON.parse(event.body)
  // TODO: Implement creating a new TODO item
  await todoModel.create(newTodo, getUserId(event))
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ item: newTodo })
  }
}
