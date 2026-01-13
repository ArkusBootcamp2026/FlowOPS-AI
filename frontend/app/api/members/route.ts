import { NextRequest, NextResponse } from 'next/server'
import { createMember } from '../../../../backend/controllers/memberController'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, email, role, skillIds } = body

    // Trim and validate required fields
    const trimmedName = name?.trim() || ''
    const trimmedEmail = email?.trim() || ''
    const trimmedRole = role?.trim() || ''

    // Validate required fields after trimming
    if (!trimmedName) {
      return NextResponse.json(
        { error: 'name is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (!trimmedEmail) {
      return NextResponse.json(
        { error: 'email is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (!trimmedRole) {
      return NextResponse.json(
        { error: 'role is required and cannot be empty' },
        { status: 400 }
      )
    }

    // Validate that skillIds is an array
    if (!Array.isArray(skillIds)) {
      return NextResponse.json(
        { error: 'skillIds must be an array' },
        { status: 400 }
      )
    }

    // Create the member using the backend controller with trimmed values
    const result = await createMember({
      fullName: trimmedName,
      email: trimmedEmail,
      role: trimmedRole,
      skillIds: skillIds || [],
    })

    if (!result) {
      return NextResponse.json(
        { error: 'Could not create member' },
        { status: 500 }
      )
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Error in API route /api/members:', error)
    return NextResponse.json(
      { error: error.message || 'Error creating member' },
      { status: 500 }
    )
  }
}

