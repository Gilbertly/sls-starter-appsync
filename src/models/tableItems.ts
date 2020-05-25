import * as DynamoDB from 'aws-sdk/clients/dynamodb';

export const getItem = async (
  documentClient: DynamoDB.DocumentClient,
  payload: {
    userId: string;
    tableName: string;
    itemId: string;
  },
) => {
  const response = await documentClient
    .query({
      TableName: payload.tableName,
      KeyConditionExpression: 'itemId = :itemId and userId = :userId',
      ExpressionAttributeValues: {
        ':userId': payload.userId,
        ':itemId': payload.itemId,
      },
    })
    .promise();
  if (response.Items) return response.Items[0];
  return response.Items;
};

export const getItems = async (
  documentClient: DynamoDB.DocumentClient,
  payload: {
    userId: string;
    tableName: string;
    indexName: string;
  },
) => {
  const response = await documentClient
    .query({
      TableName: payload.tableName,
      IndexName: payload.indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': payload.userId,
      },
    })
    .promise();
  return response.Items;
};

export const addItem = async (
  documentClient: DynamoDB.DocumentClient,
  payload: {
    userId: string;
    tableName: string;
    itemId: string;
    itemName: string;
  },
) => {
  return await documentClient
    .put({
      TableName: payload.tableName,
      Item: {
        userId: payload.userId,
        itemId: payload.itemId,
        itemName: payload.itemName,
      },
    })
    .promise();
};

export const updateItem = async (
  documentClient: DynamoDB.DocumentClient,
  payload: {
    userId: string;
    tableName: string;
    itemId: string;
    itemName: string;
  },
) => {
  return await documentClient
    .update({
      TableName: payload.tableName,
      Key: {
        userId: payload.userId,
        itemId: payload.itemId,
      },
      UpdateExpression: 'set itemName = :itemName',
      ExpressionAttributeValues: {
        ':itemName': payload.itemName,
      },
      ReturnValues: 'UPDATED_NEW',
    })
    .promise();
};

export const deleteItem = async (
  documentClient: DynamoDB.DocumentClient,
  payload: {
    userId: string;
    tableName: string;
    itemId: string;
  },
) => {
  return await documentClient
    .delete({
      TableName: payload.tableName,
      Key: {
        userId: payload.userId,
        itemId: payload.itemId,
      },
    })
    .promise();
};
