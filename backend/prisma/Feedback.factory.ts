import { PrismaClient, Prisma, Status, Sentiment } from '@prisma/client'

const prisma = new PrismaClient()

const createFeedback = async (departmentIds: number[], locationIds: number[]) => {

const feedbackData: Prisma.FeedbackCreateInput[] = [
  {
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    bookmark: false,
    intensity: 0,
    status: Status.OPEN,
    sentiment: Sentiment.NEGATIVE,
    department: { connect: { id: departmentIds[0] } },
    location: { connect: { id: locationIds[0] } },
  },
  {
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    bookmark: false,
    intensity: 1,
    status: Status.OPEN,
    sentiment: Sentiment.POSITIVE,
    department: { connect: { id: departmentIds[1] } },
    location: { connect: { id: locationIds[1] } },
  },
{
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    bookmark: true,
    intensity: 2,
    status: Status.CLOSED,
    sentiment: Sentiment.NEGATIVE,
    department: { connect: { id: departmentIds[2] } },
    location: { connect: { id: locationIds[1]} },
  }
]
  
  for (const f of feedbackData) {
    const user = await prisma.feedback.create({
      data: f,
    })
  }
}