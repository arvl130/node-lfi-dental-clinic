const listFirstNUsers = require("../../helpers/users/listFirstNUsers")

module.exports = async (req, res) => {
  try {
    const numberOfUsers = 5
    const startAtUid = req.query.startWith
    const usersList = startAtUid
      ? await listFirstNUsers(numberOfUsers + 1, startAtUid)
      : await listFirstNUsers(numberOfUsers + 1)

    // Return only the first 5 items. The last item is set as a page
    const nextValueUid = usersList.splice(numberOfUsers, 1)[0]?.uid

    res.status(200).json({
      message: `List of users (${numberOfUsers})`,
      payload: {
        users: usersList,
        nextValueUid,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    })
  }
}
