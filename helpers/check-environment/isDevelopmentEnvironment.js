function isDevelopmentEnvironment() {
  if (process.env.NODE_ENV === "development") return true
  return false
}

module.exports = isDevelopmentEnvironment
