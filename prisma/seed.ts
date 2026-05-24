import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Limpiar datos anteriores
  await prisma.empleado.deleteMany();
  await prisma.compania.deleteMany();

  // Crear compañías
  const compania1 = await prisma.compania.create({
    data: {
      nombre: 'Tech Solutions S.A.S',
      direccion: 'Calle 45 #10-20',
      telefono: '3001234567',
    },
  });

  const compania2 = await prisma.compania.create({
    data: {
      nombre: 'Innovatech Ltda',
      direccion: 'Carrera 15 #50-10',
      telefono: '3019876543',
    },
  });

  const compania3 = await prisma.compania.create({
    data: {
      nombre: 'Digital Future S.A',
      direccion: 'Avenida 30 #80-15',
      telefono: '3024567890',
    },
  });

  // Crear empleados
  await prisma.empleado.createMany({
    data: [
      {
        nombre: 'Ana',
        apellido: 'Gomez',
        correo: 'ana@tech.com',
        cargo: 'Backend Developer',
        salario: 4500000,
        companiaId: compania1.id,
      },
      {
        nombre: 'Carlos',
        apellido: 'Rojas',
        correo: 'carlos@tech.com',
        cargo: 'Frontend Developer',
        salario: 4000000,
        companiaId: compania1.id,
      },
      {
        nombre: 'Laura',
        apellido: 'Martinez',
        correo: 'laura@innovatech.com',
        cargo: 'QA Engineer',
        salario: 3500000,
        companiaId: compania2.id,
      },
      {
        nombre: 'Miguel',
        apellido: 'Torres',
        correo: 'miguel@innovatech.com',
        cargo: 'DevOps Engineer',
        salario: 5000000,
        companiaId: compania2.id,
      },
      {
        nombre: 'Sofia',
        apellido: 'Ramirez',
        correo: 'sofia@future.com',
        cargo: 'Project Manager',
        salario: 6000000,
        companiaId: compania3.id,
      },
      {
        nombre: 'Daniel',
        apellido: 'Perez',
        correo: 'daniel@future.com',
        cargo: 'UX Designer',
        salario: 3200000,
        companiaId: compania3.id,
      },
      {
        nombre: 'Valentina',
        apellido: 'Lopez',
        correo: 'valentina@tech.com',
        cargo: 'Scrum Master',
        salario: 4800000,
        companiaId: compania1.id,
      },
      {
        nombre: 'Andres',
        apellido: 'Castro',
        correo: 'andres@innovatech.com',
        cargo: 'Database Administrator',
        salario: 5300000,
        companiaId: compania2.id,
      },
      {
        nombre: 'Camila',
        apellido: 'Vargas',
        correo: 'camila@future.com',
        cargo: 'Business Analyst',
        salario: 3900000,
        companiaId: compania3.id,
      },
      {
        nombre: 'Juan',
        apellido: 'Morales',
        correo: 'juan@tech.com',
        cargo: 'Mobile Developer',
        salario: 4100000,
        companiaId: compania1.id,
      },
    ],
  });

  console.log('Seed ejecutada correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
