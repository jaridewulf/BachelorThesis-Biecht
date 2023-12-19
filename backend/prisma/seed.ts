import { PrismaClient, Prisma, Status, Sentiment } from '@prisma/client'
import { createFeedback } from './Feedback.factory';

const prisma = new PrismaClient()

const departments = ['Ruimte', 'Dienstverlening en Sociaal Beleid', 'Vrije Tijd', 'Zorg', 'Bestuur en Communicatie', 'Personeel', 'Financiën', 'Digitale Transformatie']

const departmentData: Prisma.DepartmentCreateInput[] = [
  {
    name: 'Ruimte',
    color: '#52277b'
  },
  {
    name: 'Dienstverlening en Sociaal Beleid',
    color: '#941f09'
  },
  {
    name: 'Vrije Tijd',
    color: '#009a4e'
  },
  {
    name: 'Zorg',
    color: '#f3bf41'
  },
  {
    name: 'Bestuur en Communicatie',
    color: '#123274'
  },
  {
    name: 'Personeel',
    color: '#0065b0'
  },
  {
    name: 'Financiën',
    color: '#004c4b'
  }, {
    name: 'Digitale Transformatie',
    color: '#e8366f'
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