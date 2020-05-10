import * as DynamoDB from 'aws-sdk/clients/dynamodb';

interface AddItem {
  tableName: string;
  itemId: string;
  item: string;
}

interface GetItem {
  tableName: string;
  itemId: string;
}

export const getItem = async (
  documentClient: DynamoDB.DocumentClient,
  payload: GetItem,
) => {
  return await documentClient
    .query({
      TableName: payload.tableName,
      KeyConditionExpression: 'itemID = :itemId',
      ExpressionAttributeValues: {
        ':itemId': payload.itemId,
      },
    })
    .promise();
};

export const addItem = async (
  documentClient: DynamoDB.DocumentClient,
  payload: AddItem,
) => {
  return await documentClient
    .put({
      TableName: payload.tableName,
      Item: {
        itemID: payload.itemId,
        item: payload.item,
      },
    })
    .promise();
};
