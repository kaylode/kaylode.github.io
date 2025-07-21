import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line no-undef
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
