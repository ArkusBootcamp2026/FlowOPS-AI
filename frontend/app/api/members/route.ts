import { NextRequest, NextResponse } from 'next/server'
import { createMember } from '../../../../backend/controllers/memberController'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, email, role, skillIds } = body

    // Validar campos requeridos
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'name, email y role son campos requeridos' },
        { status: 400 }
      )
    }

    // Validar que skillIds sea un array
    if (!Array.isArray(skillIds)) {
      return NextResponse.json(
        { error: 'skillIds debe ser un array' },
        { status: 400 }
      )
    }

    // Crear el miembro usando el controlador del backend
    const result = await createMember({
      fullName: name,
      email: email,
      role: role,
      skillIds: skillIds || [],
    })

    if (!result) {
      return NextResponse.json(
        { error: 'No se pudo crear el miembro' },
        { status: 500 }
      )
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Error en API route /api/members:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear el miembro' },
      { status: 500 }
    )
  }
}

