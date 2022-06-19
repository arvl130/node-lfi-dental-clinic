const listFirstNUsers = require("../../helpers/users/listFirstNUsers")

module.exports = async (req, res) => {
  try {
    const numberOfUsers = 5
    const usersList = await listFirstNUsers(numberOfUsers)

    res.status(200).json({
      message: `List of users (${numberOfUsers})`,
      payload: usersList,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    })
  }
}
