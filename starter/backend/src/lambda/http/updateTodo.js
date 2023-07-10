import { todoModel } from '../../model/todo.js'
import { getUserId } from '../auth/jwt.js'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const result = await todoModel.update(updatedTodo, todoId, getUserId(event))
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ item: result }, null, 2)
  }
}
