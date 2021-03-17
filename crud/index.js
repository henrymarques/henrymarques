const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { Client } = require('pg')

const app = express()
const client = new Client(require('./databaseConfig.js'))
client.connect(err => {
  if (err) throw err
})

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/user/create', async (req, res) => {
  const { situacao, nome } = req.body
  client
    .query(`SELECT nome FROM users WHERE nome = upper('${nome}')`)
    .then(async result => {
      if (result.rowCount > 0) {
        res.status(400).json({ message: 'O usuário já existe!' })
      } else {
        await client.query(
          `INSERT INTO users VALUES(default, upper('${nome}'), ${parseInt(
            situacao
          )})`
        )
        res.status(200).json({ message: 'Criado com sucesso!' })
      }
    })
    .catch(err => {
      res.send(err)
    })
    .then(async () => {
      await client.end
    })
})

app.get('/users', async (req, res) => {
  const result = await client.query('SELECT * FROM users')
  await client.end
  res.status(200).json(result.rows)
})

app.get('/user/:id', async (req, res) => {
  const { id } = req.params
  const result = await client.query(`SELECT * FROM users WHERE id = ${id}`)
  await client.end
  res.status(200).json(result.rows[0])
})

app.post('/user/update/:id', async (req, res) => {
  const { id } = req.params
  const { nome, situacao } = req.body

  client
    .query(`SELECT nome FROM users WHERE id = '${id}'`)
    .then(async result => {
      if (!result.rowCount > 0) {
        res.status(400).json({ message: 'O usuário não existe!' })
      } else {
        await client.query(
          `UPDATE users SET nome = upper('${nome}'), situacao = ${situacao} WHERE id = ${id}`
        )
        res.status(200).json({ message: 'Atualizado com sucesso!' })
      }
    })
    .catch(err => {
      res.json(err)
    })
    .then(async () => {
      await client.end
    })
})

app.get('/user/delete/:id', async (req, res) => {
  const { id } = req.params
  await client.query(`DELETE FROM users WHERE id = ${id}`)
  await client.end
  res.status(200).json({ message: 'Deletado com sucesso!' })
})

app.listen(3333, () => {
  console.log('server listening on port 3333')
})
