import express from  "express"
const app = express()

app.get('/', (req:any, res:any) => {
  res.send('hell world')
})

app.listen(3000)