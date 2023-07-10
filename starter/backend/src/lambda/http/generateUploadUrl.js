import { todoModel } from '../../model/todo.js'

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return todoModel.getPresignedUrl(todoId)
}
