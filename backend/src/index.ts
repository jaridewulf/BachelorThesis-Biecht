import { Prisma, PrismaClient, Status, Sentiment } from '@prisma/client'
import express from 'express'
require('dotenv').config()
const cors = require('cors')

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.get('/', async (req, res) => {
  try {
    // stuur api de biecht
    res.send('API de biecht is online');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// send back all departments
app.get(`/departments`, async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// send back all feedbacks
app.get(`/feedback`, async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get(`/feedback/department/:departmentId`, async (req, res) => {
  try {
    const { departmentId } = req.params;
    const feedbacks = await prisma.feedback.findMany({
      where: { departmentId: Number(departmentId) },
    });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get(`/feedback/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await prisma.feedback.findUnique({
      where: { id: Number(id) },
    });
    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post(`/feedback`, async (req, res) => {
  try {
    const result = await prisma.feedback.create({
      data: {
        audioUrls: req.body.audioUrls,
        intensity: req.body.intensity,
        sentiment: req.body.sentiment,
        departmentId: req.body.departmentId,
        locationId: req.body.locationId,
        status: Status.OPEN,
        bookmark: false,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch(`/feedback/:id/status`, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const feedback = await prisma.feedback.update({
      where: { id: Number(id) },
      data: { status: status },
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch(`/feedback/:id/bookmark`, async (req, res) => {
  try {
    const { id } = req.params;
    const { bookmarkStatus } = req.body;

    const feedback = await prisma.feedback.update({
      where: { id: Number(id) },
      data: { bookmark: bookmarkStatus },
    });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const server = app.listen(3000, () =>
  console.log('🚀 Server ready at: http://localhost:3000')
);