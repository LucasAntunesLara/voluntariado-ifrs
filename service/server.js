const app = require('./src/app')
// eslint-disable-next-line
const PORT = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
  console.log(`API disponível em http://localhost:${PORT}`)
})
