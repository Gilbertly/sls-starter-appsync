import * as DynamoDB from 'aws-sdk/clients/dynamodb';

interface AddItem {
  tableName: string;
  itemId: string;
  itemName: string;
}

interface GetItem {
  tableName: string;
  itemId: string;
}

export const getItem = async (
  documentClient: DynamoDB.DocumentClient,
  payload: GetItem,
) => {
  const data = await documentClient
    .query({
      TableName: payload.tableName,
      KeyConditionExpression: 'itemId = :itemId',
      ExpressionAttributeValues: {
        ':itemId': payload.itemId,
      },
    })
    .promise();
  if (data.Items) return data.Items[0];
  return data.Items;
};

export const addItem = async (
  documentClient: DynamoDB.DocumentClient,
  payload: AddItem,
) => {
  return await documentClient
    .put({
      TableName: payload.tableName,
      Item: {
        itemId: payload.itemId,
        itemName: payload.itemName,
      },
    })
    .promise();
};
