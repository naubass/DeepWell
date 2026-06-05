import server from './server/index.js'

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`App listening on port http://localhost:${PORT}`)
})
