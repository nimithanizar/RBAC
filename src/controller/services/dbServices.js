/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable no-unneeded-ternary */
import * as Realm from 'realm-web';
import envConfig from '../../env/env.json';

export const app = new Realm.App({ id: envConfig.MONGODB_APP_ID });
export const gApp = new Realm.App({ id: envConfig.MONGODB_APP_ID_GENERAL });
export const {
  BSON: { ObjectId },
} = Realm;
export const getDBInstance = () => {
  if (!app || !app.currentUser) {
    return;
  }
  return app.currentUser.mongoClient('mongodb-atlas').db(envConfig.MONGODB_DB);
};

export const generalLogin = async () => {
  const gUser = await gApp.logIn(Realm.Credentials.apiKey(envConfig.MONGODB_APP_TOKEN_GENERAL));
  return gUser;
};

export const getCurrentUser = async ({ id }) => {
  if (!app || !app.currentUser) {
    return;
  }

  if (!id) {
    return;
  }
  if (typeof id === 'string') {
    id = new ObjectId(id);
  }

  const result = await getDBInstance()
    .collection('users')
    .aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: 'userRoles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'role',
        },
      },
      { $unwind: '$role' },
      {
        $project: {
          email: 1,
          firstName: 1,
          lastName: 1,
          number: 1,
          createdAt: 1,
          updatedAt: 1,
          isVerified: 1,
          roleId: 1,
          role: 1,
          permissions: '$role.permissions',
        },
      },
    ]);

  return result[0];
};

export const DeleteRole = async ({ id }) => {
  if (!app || !app.currentUser) {
    return;
  }
  if (typeof id === 'string') {
    id = new ObjectId(id);
  }

  const result = await getDBInstance().collection('userRoles').deleteOne({ _id: id });

  return result;
};

export const AddRole = async ({ data, permissions }) => {
  if (!app || !app.currentUser) {
    return;
  }

  if (!data) {
    return;
  }

  const existingRole = await getDBInstance()
    .collection('userRoles')
    .findOne({
      name: { $regex: new RegExp(`^${data.name}$`, 'i') },
    });
  if (existingRole) {
    return false;
  }
  const result = await getDBInstance().collection('userRoles').insertOne({
    name: data.name,
    permissions,
  });
  return result;
};

export const UpdateRole = async ({ id, data, permissions }) => {
  if (!app || !app.currentUser) {
    return;
  }
  if (!id || !data) {
    return;
  }
  if (typeof id === 'string') {
    id = new ObjectId(id);
  }

  const result = await getDBInstance()
    .collection('userRoles')
    .updateOne(
      {
        _id: id,
      },
      {
        $set: {
          name: data.name,
          permissions,
        },
      },
    );

  return result;
};

export const getRoles = async ({ search }) => {
  if (!app || !app.currentUser) {
    return;
  }

  let query = {};

  if (search) {
    query = {
      $or: [{ name: { $regex: search, $options: 'i' } }],
    };
  }

  const result = await getDBInstance()
    .collection('userRoles')
    .aggregate([
      {
        $match: query,
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

  return result;
};

export const getOneRole = async ({ id }) => {
  if (!app || !app.currentUser) {
    return;
  }
  if (!id) {
    return;
  }
  if (typeof id === 'string') {
    id = new ObjectId(id);
  }

  const result = await getDBInstance()
    .collection('userRoles')
    .aggregate([
      {
        $match: { _id: id },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

  return result[0];
};

export const getRegisterRoles = async () => {
  if (!app || !app.currentUser) {
    const credentials = Realm.Credentials.anonymous();
    await app.logIn(credentials);
  }

  const result = await getDBInstance()
    .collection('userRoles')
    .aggregate([
      {
        $match: {},
      },
      {
        $replaceRoot: {
          newRoot: {
            value: { $toString: '$_id' },
            label: '$name',
          },
        },
      },
    ]);

  return result;
};

export const userRegister = async ({ data, roleId }) => {
  if (!data || !roleId) {
    return;
  }

  const credentials = Realm.Credentials.anonymous();
  const test = await app.logIn(credentials);

  if (test) {
    const result = await app.currentUser.callFunction('register', {
      data,
      roleId,
    });

    if (app.currentUser) {
      app.currentUser.logOut();
    }
    return result;
  }
};

export const getUserRegisterRoles = async () => {
  if (!app || !app.currentUser) {
    return;
  }

  const result = await getDBInstance()
    .collection('userRoles')
    .aggregate([
      {
        $match: {},
      },
      {
        $replaceRoot: {
          newRoot: {
            value: { $toString: '$_id' },
            label: '$name',
          },
        },
      },
    ]);

  return result;
};

export const userAddWithRole = async ({ data, roleId }) => {
  if (!app || !app.currentUser) {
    return;
  }
  if (!data || !roleId) {
    return;
  }
  if (typeof roleId === 'string') {
    roleId = new ObjectId(roleId);
  }

  const result = await getDBInstance().collection('users').insertOne({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    number: data.number,
    createdAt: new Date(),
    updatedAt: null,
    isVerified: false,
    roleId,
  });
  return result;
};

export const userUpdateWithRole = async ({ id, data, roleId }) => {
  if (!app || !app.currentUser) {
    return;
  }
  if (!id || !data || !roleId) {
    return;
  }
  if (typeof id === 'string') {
    id = new ObjectId(id);
  }

  if (typeof roleId === 'string') {
    roleId = new ObjectId(roleId);
  }
  const specificRoleId = new ObjectId('661d7c37952ae5895d13ea85');
  const findResult = await getDBInstance().collection('users').find({ roleId: specificRoleId });
  if (findResult.length === 1) {
    const Result = await getDBInstance().collection('users').findOne({ _id: id });
    if (Result.roleId.toString() === specificRoleId.toString()) {
      return false;
    }
    await getDBInstance()
      .collection('users')
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            firstName: data.firstName,
            lastName: data.lastName,
            number: data.number,
            updatedAt: new Date(),
            roleId,
          },
        },
      );

    return true;
  }
  await getDBInstance()
    .collection('users')
    .updateOne(
      {
        _id: id,
      },
      {
        $set: {
          firstName: data.firstName,
          lastName: data.lastName,
          number: data.number,
          updatedAt: new Date(),
          roleId,
        },
      },
    );

  return true;
};

export const DeleteUser = async ({ id }) => {
  if (!app || !app.currentUser) {
    return;
  }
  if (typeof id === 'string') {
    id = new ObjectId(id);
  }

  const specificRoleId = new ObjectId('661d7c37952ae5895d13ea85');
  const findResult = await getDBInstance().collection('users').find({ roleId: specificRoleId });
  if (findResult.length === 1) {
    const Result = await getDBInstance().collection('users').findOne({ _id: id });
    if (Result.roleId.toString() === specificRoleId.toString()) {
      return false;
    }
    await getDBInstance().collection('users').deleteOne({ _id: id });
    return true;
  }
  await getDBInstance().collection('users').deleteOne({ _id: id });
  return true;
};

export const getOneUser = async ({ id }) => {
  if (!app || !app.currentUser) {
    return;
  }
  if (!id) {
    return;
  }
  if (typeof id === 'string') {
    id = new ObjectId(id);
  }

  const result = await getDBInstance()
    .collection('users')
    .aggregate([
      {
        $match: { _id: id },
      },
      {
        $lookup: {
          from: 'userRoles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'getRole',
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

  return result[0];
};

export const getUsers = async ({ search }) => {
  if (!app || !app.currentUser) {
    return;
  }

  let query = {};

  if (search) {
    query = {
      $or: [{ email: { $regex: search, $options: 'i' } }],
    };
  }

  const result = await getDBInstance()
    .collection('users')
    .aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: 'userRoles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'getRole',
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

  return result;
};

export const sendEmailAfterLogin = async ({ toEmail }) => {
  if (!toEmail) {
    return;
  }

  const result = await app.currentUser.callFunction('reSendEmail', {
    toEmail,
  });
  return result;
};

export const verifyOTP = async ({ email, submittedOtp }) => {
  if (!email || !submittedOtp) {
    return;
  }

  const result = await app.currentUser.callFunction('verifyOTP', { email, submittedOtp });
  return result;
};
