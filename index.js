// load any environment variables
require("dotenv").config()

// initialize Firebase Admin
require("./firebase")

const express = require("express")
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000

// register middleware for CORS and JSON
app.use(cors())
app.use(express.json())

const authRoute = require("./routes/auth")
const messagesRoute = require("./routes/messages")
const timeslotsRoute = require("./routes/timeslots")
const usersRoute = require("./routes/users")
const appointmentsRoute = require("./routes/appointments")

app.use("/users", usersRoute)
app.use("/auth", authRoute)
app.use("/messages", messagesRoute)
app.use("/timeslots", timeslotsRoute)
app.use("/appointments", appointmentsRoute)

app.use((req, res) => {
  res.status(404).json({
    message: "No such endpoint",
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port} ...`)
})

// Export Express app so that Vercel can host it.
module.exports = app
