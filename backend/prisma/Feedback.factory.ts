import { PrismaClient, Prisma, Status, Sentiment } from '@prisma/client'

const prisma = new PrismaClient()

export const createFeedback = async (departmentIds: number[], locationIds: number[]) => {

  const feedbackData: Prisma.FeedbackCreateInput[] = [
    {
      audioUrls: { open: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', closed: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      bookmark: false,
      intensity: 7,
      status: Status.OPEN,
      sentiment: Sentiment.NEGATIVE,
      department: { connect: { id: departmentIds[0] } },
      location: { connect: { id: locationIds[0] } },
    },
    {
      audioUrls: { open: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', closed: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      bookmark: false,
      intensity: 8,
      status: Status.OPEN,
      sentiment: Sentiment.POSITIVE,
      department: { connect: { id: departmentIds[1] } },
      location: { connect: { id: locationIds[1] } },
    },
    {
      audioUrls: { open: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', closed: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      bookmark: true,
      intensity: 8,
      status: Status.CLOSED,
      sentiment: Sentiment.NEGATIVE,
      department: { connect: { id: departmentIds[2] } },
      location: { connect: { id: locationIds[1] } },
    }
  ]

  for (const f of feedbackData) {
    const user = await prisma.feedback.create({
      data: f,
    })
  }
}