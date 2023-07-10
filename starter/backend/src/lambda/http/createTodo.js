import { todoModel } from '../../model/todo.js'

export async function handler(event, context, callback) {
  const newTodo = JSON.parse(event.body)
  // const jwtToken = event.headers.Authorization.split(' ')[1]
  // TODO: Implement creating a new TODO item
  await todoModel.create(newTodo)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(newTodo)
  }
}
