const { getAuth } = require("firebase-admin/auth");

const auth = getAuth();
let usersList;

const getAllUsers = async (nextPageToken) => {
  const usersListResult = await auth.listUsers(1000, nextPageToken);
  usersListResult.users.forEach((userRecord) => {
    usersList.push(userRecord.toJSON());
  });

  if (usersListResult.pageToken) {
    await getAllUsers(usersListResult.pageToken);
  }
};

module.exports = async () => {
  usersList = [];
  await getAllUsers();
  return usersList;
};
