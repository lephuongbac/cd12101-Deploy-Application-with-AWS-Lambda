// import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand
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
  async create(todo, userId) {
    logger.info('Creating a todo', todo)
    const dbTodo = {
      ...todo,
      todoId: nanoid(),
      userId,
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
  async getAll(userId) {
    // const params = {
    //   TableName: this.tableName,
    //   KeyConditionExpression: '#userId = :userId',
    //   FilterExpression: 'userId = :userId',
    //   ExpressionAttributeValues: {
    //     ':userId': userId
    //   }
    // }
    const params = {
      ExpressionAttributeValues: {
        ':userId': {
          S: userId
        }
      },
      KeyConditionExpression: 'userId = :userId',
      TableName: this.tableName
    }
    console.log(params)
    const result = await docClient.send(new QueryCommand(params))
    return result.Items.map((item) => {
      return {
        todoId: item.todoId.S,
        createdAt: item.createdAt.S,
        name: item.name?.S,
        dueDate: item.dueDate?.S,
        done: item.done?.B,
        attachmentUrl: item.attachmentUrl?.S
      }
    })
  }
  async update(todoUpdate, todoId, userId) {
    logger.info('Updating a todo', todoUpdate)
    const params = {
      TableName: this.tableName,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': todoUpdate.name,
        ':dueDate': todoUpdate.dueDate,
        ':done': todoUpdate.done
      },
      ReturnValues: 'UPDATED_NEW'
    }
    const result = await docClient.send(new UpdateCommand(params))
    console.log(result)
    return todoUpdate
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
