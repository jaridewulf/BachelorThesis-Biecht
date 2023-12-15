import { Prisma, PrismaClient, Status, Sentiment } from '@prisma/client'
import express from 'express'
require('dotenv').config()
const cors = require('cors')

const app = express()
const prisma = new PrismaClient()

// Enable CORS for all routes
app.use(cors())

app.get('/', async (req, res) => {
  // stuur api de biecht
  res.send('API de biecht is online');
});

// send back all feedbacks
app.get(`/feedback`, async (req, res) => {
  if (req.body?.departmentId) {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        departmentId: Number(req.body.departmentId)
      }
    })
    res.json(feedbacks)
  } else {
    const feedbacks = await prisma.feedback.findMany()
    res.json(feedbacks)
  }
});

app.get(`/feedback/:id`, async (req, res) => {
  const { id } = req.params
  const feedback = await prisma.feedback.findUnique({
    where: { id: Number(id) },
  })
  res.json(feedback)
});

app.post(`/feedback`, async (req, res) => {
  const result = await prisma.feedback.create({
    data: {
      audioUrls: req.body.audioUrl,
      intensity: req.body.intensity,
      sentiment: req.body.sentiment,
      departmentId: req.body.departmentId,
      locationId: req.body.locationId,
      status: Status.OPEN,
      bookmark: false,
    }
  });
  res.json(result)
})

app.patch(`/feedback/:id/status`, async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const feedback = await prisma.feedback.update({
    where: { id: Number(id) },
    data: { status: status },
  })
  res.json(feedback)
});

app.patch(`/feedback/:id/bookmark`, async (req, res) => {
  const { id } = req.params
  const { bookmarkStatus } = req.body

  const feedback = await prisma.feedback.update({
    where: { id: Number(id) },
    data: { bookmark: bookmarkStatus },
  })

  res.json(feedback)
})

const server = app.listen(3000, () =>
  console.log('🚀 Server ready at: http://localhost:3000'))