import { todoModel } from '../../model/todo.js'

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  // return todoModel.getPresignedUrl(todoId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: await todoModel.getPresignedUrl(todoId)
    })
  }
}
