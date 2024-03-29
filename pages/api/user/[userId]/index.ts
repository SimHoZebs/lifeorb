import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import apiEndpointHelper from '../../../../lib/helper/apiEndpointHelper';
import { TaskDoc } from '../../../../lib/task/types';
import db from '../../../../lib/db';
import { UserDoc } from '../../../../lib/user/types';

export type Get = Awaited<ReturnType<typeof get>>;
async function get() {
  throw new Error("This endpoint is not implemented yet.");
}

export type Post = Awaited<ReturnType<typeof post>>;
async function post(body: Body, userId: string) {
  if (!(body.task && userId)) throw new Error("Missing required fields");

  const userCollection = await db.then(res => res.collection<UserDoc>('users'));

  //Figure out how to insert a new task into the task array
  const user = await userCollection.findOne({ _id: new ObjectId(userId) });

  if (!user) throw new Error("User does not exist");

  return await userCollection.findOneAndUpdate({ _id: new ObjectId(userId) }, {
    $set: {
      taskArray: [...user.taskArray, body.task]
    }
  });
}

export type Patch = Awaited<ReturnType<typeof patch>>;
async function patch(body: Body, userId: ObjectId) {

  const userCollection = await db.then(res => res.collection('users'));
  //Figure out how to update a task in the task array
  return await userCollection.findOneAndUpdate({ _id: new ObjectId(userId) }, {});
}

export type Del = Awaited<ReturnType<typeof del>>;
async function del(body: Body, userId: ObjectId) {
  if (!(typeof (body.taskIndex) === "number" && userId)) throw new Error(`Missing required fields, taskIndex is ${body.taskIndex} and userId is ${userId}`);
  const _id = new ObjectId(userId);

  const userCollection = await db.then(res => res.collection('users'));
  const user = await userCollection.findOne({ _id }) as UserDoc | null;

  if (!user) throw new Error(`UserId ${_id} does not exist`);

  user.taskArray.splice(body.taskIndex, 1);
  const taskArray = user.taskArray;

  return await userCollection.findOneAndUpdate(
    { _id },
    { $set: { taskArray } }
  );
};

export interface Body {
  task?: TaskDoc;
  target?: string; //updateLastViewedGoalId
  taskId?: ObjectId;
  taskIndex?: number; //deleteTask
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body: Body = req.body;
  const { userId } = req.query;

  const { status, response } = await apiEndpointHelper(req,

    async function getWrapper() {
      return get();
    },

    async function postWrapper() {
      return post(body, userId as string);
    },

    async function patchWrapper() {
      return patch(body, userId as unknown as ObjectId);
    },

    async function delWrapper() {
      return del(body, userId as unknown as ObjectId);
    }
  );

  res.status(status).json(response);
}