import { supabase } from '../config/db'

export interface CreateMemberInput {
  fullName: string
  email: string
  role: 'Sales' | 'Tech' | 'Admin'
  skillIds: string[] // Array de UUIDs de skills
}

export interface MemberFromDB {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
}

/**
 * Crea un nuevo miembro del equipo en la base de datos
 * @param input - Datos del miembro a crear
 * @returns El miembro creado o null si hay error
 */
export async function createMember(input: CreateMemberInput): Promise<MemberFromDB | null> {
  try {
    // Validar campos requeridos
    if (!input.fullName || !input.email || !input.role) {
      throw new Error('fullName, email y role son campos requeridos')
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(input.email)) {
      throw new Error('El formato del email no es válido')
    }

    // Validar que skillIds sea un array (puede estar vacío)
    if (!Array.isArray(input.skillIds)) {
      throw new Error('skillIds debe ser un array')
    }

    // 1. Verificar si el email ya existe
    const { data: existingMember, error: checkError } = await supabase
      .from('Profiles')
      .select('id, email')
      .eq('email', input.email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 es "no rows returned", que es esperado si no existe
      console.error('Error verificando email existente:', checkError)
      throw checkError
    }

    if (existingMember) {
      throw new Error('Ya existe un miembro con este email')
    }

    // 2. Crear el perfil en la tabla Profiles
    const { data: newMember, error: memberError } = await supabase
      .from('Profiles')
      .insert({
        full_name: input.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        role: input.role,
      })
      .select('id, full_name, email, role, created_at')
      .single()

    if (memberError) {
      console.error('Error creando miembro:', memberError)
      throw memberError
    }

    if (!newMember) {
      throw new Error('No se pudo crear el miembro')
    }

    // 3. Vincular skills en la tabla user_skills si hay skills seleccionadas
    if (input.skillIds.length > 0) {
      // Validar que todas las skills existan en la base de datos
      const { data: existingSkills, error: skillsCheckError } = await supabase
        .from('Skills')
        .select('id')
        .in('id', input.skillIds)

      if (skillsCheckError) {
        console.error('Error verificando skills:', skillsCheckError)
        throw skillsCheckError
      }

      if (!existingSkills || existingSkills.length !== input.skillIds.length) {
        throw new Error('Una o más skills no existen en la base de datos')
      }

      // Crear las relaciones en user_skills
      const userSkillsData = input.skillIds.map(skillId => ({
        user_id: newMember.id,
        skill_id: skillId,
      }))

      const { error: userSkillsError } = await supabase
        .from('user_skills')
        .insert(userSkillsData)

      if (userSkillsError) {
        console.error('Error vinculando skills:', userSkillsError)
        // Intentar eliminar el miembro creado si falla la vinculación de skills
        await supabase.from('Profiles').delete().eq('id', newMember.id)
        throw userSkillsError
      }
    }

    return {
      id: newMember.id,
      full_name: newMember.full_name,
      email: newMember.email,
      role: newMember.role,
      created_at: newMember.created_at,
    }
  } catch (error: any) {
    console.error('Error en createMember:', error)
    throw error
  }
}

