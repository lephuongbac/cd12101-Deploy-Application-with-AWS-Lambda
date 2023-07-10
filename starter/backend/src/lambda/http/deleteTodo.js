import { todoModel } from '../../model/todo.js'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  console.log('deleteTodo', todoId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(todoModel.delete(todoId, '123'))
  }
}
