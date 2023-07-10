// import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb'
import { nanoid } from 'nanoid'
// const documentClient = new DynamoDB()
// High-level client
const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)
import { createLogger } from '../utils/logger.mjs'
import {
  S3Client,
  AbortMultipartUploadCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3'
import S3 from 'aws-sdk/clients/s3.js'

const logger = createLogger('TodoModel')

// const s3Client = new S3Client({ region: 'us-east-2' })
const s3Client = new S3({ signatureVersion: 'v4' })

export class TodoModel {
  tableName
  constructor(tableName = process.env.TODOS_TABLE) {
    this.tableName = tableName
  }
  async create(todo) {
    logger.info('Creating a todo', todo)
    const dbTodo = {
      ...todo,
      todoId: nanoid(),
      userId: '123',
      done: false,
      createdAt: new Date().toISOString()
    }
    console.log(dbTodo, this.tableName)
    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: dbTodo
      })
    )
    return dbTodo
  }
  async getAll() {
    const params = {
      TableName: this.tableName
    }
    const result = await docClient.send(new ScanCommand(params))
    return result.Items
  }
  async update(todo) {
    logger.info('Updating a todo', todo)
    const params = {
      TableName: this.tableName,
      Key: {
        todoId: todo.todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done
      },
      ReturnValues: 'UPDATED_NEW'
    }
    await docClient.send(new DeleteCommand(params))
    return todo
  }
  async delete(todoId, userId) {
    logger.info('Deleting a todo', todoId)
    const params = {
      TableName: this.tableName,
      Key: {
        todoId,
        userId
      }
    }
    await docClient.send(new DeleteCommand(params))

    return todoId
  }
  async getPresignedUrl(todoId) {
    // logger.info('Getting a presigned url', todoId)
    // const params = {
    //   Bucket: process.env.ATTACHMENT_S3_BUCKET,
    //   Key: todoId,
    //   Expires: 1000
    // }
    // const command = new PutObjectCommand(params)
    // const url = await getSignedUrl(s3Client, command)
    // return url
    console.log('Generating URL', process.env.ATTACHMENT_S3_BUCKET)

    const url = s3Client.getSignedUrl('putObject', {
      Bucket: process.env.ATTACHMENT_S3_BUCKET,
      Key: todoId,
      Expires: 1000
    })
    console.log(url)
    return url
  }
}
export const todoModel = new TodoModel()
