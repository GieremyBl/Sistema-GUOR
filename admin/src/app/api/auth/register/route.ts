import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, nombre, apellido, telefono, direccion, rol } = body;

    // Validaciones
    if (!email || !password || !nombre || !apellido || !rol) {
      return NextResponse.json(
        { error: "Campos requeridos: email, password, nombre, apellido, rol" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en la base de datos
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        contraseña: hashedPassword,
        nombre,
        apellido,
        telefono: telefono || null,
        direccion: direccion || null,
        rol: rol || "cliente",
        estado: true,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        createdAt: true,
      }
    });

    console.log("✅ Usuario creado:", nuevoUsuario.email);

    // 1. Extrae el usuario creado
    const usuarioCreado = nuevoUsuario; 

    // 2. Crea un nuevo objeto para la respuesta, convirtiendo el BigInt 'id' a string
    const usuarioParaRespuesta = {
        ...usuarioCreado, // Copia todas las demás propiedades
        id: usuarioCreado.id.toString(), // Convierte el BigInt a string
    };

    // 3. Usa el nuevo objeto al retornar
    return NextResponse.json({
        message: "Usuario registrado exitosamente",
        usuario: usuarioParaRespuesta 
    }, { status: 201 }); 

  } catch (error: any) {
    console.error("💥 Error al registrar usuario:", error);
    
    // Errores específicos de Prisma
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "El email ya está en uso" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error al registrar el usuario. Intenta nuevamente." },
      { status: 500 }
    );
  }
}