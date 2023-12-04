import { PrismaClient, Prisma, Status, Sentiment } from '@prisma/client'
import {createFeedback  } from './Feedback.factory';

const prisma = new PrismaClient()

const departments = ['Ruimte', 'Dienstverlening en Sociaal Beleid', 'Vrije Tijd', 'Zorg', 'Bestuur en Communicatie', 'Personeel', 'Financiën', 'Digitale Transformatie']

const departmentData: Prisma.DepartmentCreateInput[] = [
  {
    name: 'Ruimte'
  },
  {
    name: 'Dienstverlening en Sociaal Beleid'
  },
  {
    name: 'Vrije Tijd'
  },
  {
    name: 'Zorg'
  },
  {
    name: 'Bestuur en Communicatie'
  },
  {
    name: 'Personeel'
  },
  {
    name: 'Financiën'
  },{
    name: 'Digitale Transformatie'
  }
]

const locationData: Prisma.LocationCreateInput[] = [
  {
    name: 'Stadhuis'
  },
  {
    name: 'Bibliotheek'
  }
]



async function main() {
  console.log(`Start seeding ...`)
  const locationIds = [];
  const departmentIds = []

  for (const d of departmentData) {
    const department = await prisma.department.create({
      data: d,
    })
    departmentIds.push(department.id)
  }

  for (const l of locationData) {
    const location = await prisma.location.create({
      data: l,
    })
    locationIds.push(location.id);
  }
  createFeedback(departmentIds, locationIds)
}

main().then(() => {
  console.log('seeding finished');
}).catch((e) => {
  console.error(e)
})