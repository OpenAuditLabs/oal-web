import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success, error } from '@/lib/result'
import bcryptjs from 'bcryptjs'
import { SignupInput } from './schema'
import { getSession } from '@/lib/session'

export type NewUser = {
  id: string
  name: string
  email: string
  role: string
}

export async function signup(input: SignupInput): Promise<Result<NewUser>> {
  const name = input.name
  const email = input.email
  const password = input.password

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) {
    console.error('Signup error: Email already in use')
    return error('Signup Error')
  }

  const hashed = await bcryptjs.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, role: true },
  })

  const session = await getSession()
  session.user = { id: user.id }
  await session.save()

  return success(user)
}
