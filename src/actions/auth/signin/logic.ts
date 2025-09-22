import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success, error } from '@/lib/result'
import bcryptjs from 'bcryptjs'
import { SigninInput } from './schema'
import { getSession } from '@/lib/session'

export type UserWithoutPassword = {
  id: string
  name: string
  email: string
  role: string
}

export async function signin(input: SigninInput): Promise<Result<UserWithoutPassword>> {
  const { email, password } = input

  const normalisedEmail = email.trim().toLowerCase()

  const user = await prisma.user.findUnique({
    where: { email: normalisedEmail },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
    },
  })

  if (!user) {
    console.error('Signin error: User not found')
    return error('Invalid credentials')
  }

  const isValidPassword = await bcryptjs.compare(password, user.password)
  if (!isValidPassword) {
    console.error('Signin error: Invalid password')
    return error('Invalid credentials')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = user

  const session = await getSession()
  session.user = { id: userWithoutPassword.id, email: userWithoutPassword.email, name: userWithoutPassword.name }
  await session.save()

  return success(userWithoutPassword)
}
