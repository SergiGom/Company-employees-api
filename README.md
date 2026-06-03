# API de Compañías y Empleados

API REST · Onion Architecture
Guía de Actividad Práctica

---

# Tecnología usada

El proyecto fue desarrollado utilizando tecnologías modernas del ecosistema JavaScript/TypeScript orientadas al desarrollo backend.

## Tecnologías principales

| Tecnología      | Uso                     |
| --------------- | ----------------------- |
| Node.js         | Runtime de ejecución    |
| TypeScript      | Lenguaje principal      |
| NestJS          | Framework backend       |
| Prisma ORM      | Acceso a base de datos  |
| SQL Server      | Motor de base de datos  |
| Swagger         | Documentación de la API |
| class-validator | Validación de DTOs      |
| Winston         | Sistema de logging      |

---

# ORM usado

El ORM utilizado en el proyecto es Prisma ORM.

Prisma permite:

* Modelar entidades desde un archivo schema.
* Generar automáticamente el cliente de base de datos.
* Realizar consultas tipadas.
* Ejecutar transacciones.
* Simplificar operaciones CRUD.

Archivo principal:

```bash
prisma/schema.prisma
```

Ejemplo de uso:

```ts
await this.prisma.company.create({
  data: createCompanyDto,
});
```

---

# Arquitectura aplicada

El proyecto implementa una arquitectura basada en Onion Architecture / Clean Architecture.

La aplicación está dividida en capas independientes:

* Domain
* Application
* Infrastructure
* Presentation

La regla principal de esta arquitectura es:

> Las dependencias siempre apuntan hacia el dominio.

Esto permite:

* Bajo acoplamiento
* Mayor mantenibilidad
* Separación de responsabilidades
* Escalabilidad
* Facilidad para pruebas

---

# Estructura del proyecto

```bash
src/
│
├── application/
│   ├── dto/
│   ├── services/
│   └── unit-of-work/
│
├── domain/
│   ├── entities/
│   └── repositories/
│
├── infrastructure/
│   ├── prisma/
│   └── repositories/
│
├── presentation/
│   └── controllers/
│
├── common/
│   └── logging/
│
└── main.ts
```

---

# Entidades

El proyecto trabaja principalmente con dos entidades:

## Company

Representa una compañía registrada en el sistema.

### Campos principales

* id
* name
* address
* phone
* email

---

## Employee

Representa un empleado perteneciente a una compañía.

### Campos principales

* id
* firstName
* lastName
* email
* salary
* companyId

---

# Relación entre entidades

La relación entre entidades es:

```text
Company 1 ---- * Employee
```

Una compañía puede tener múltiples empleados.
Un empleado pertenece únicamente a una compañía.

En Prisma la relación se define mediante claves foráneas:

```prisma
model Company {
  id        Int        @id @default(autoincrement())
  employees Employee[]
}

model Employee {
  id        Int     @id @default(autoincrement())
  companyId Int
  company   Company @relation(fields: [companyId], references: [id])
}
```

---

# Repository Pattern

El proyecto implementa el patrón Repository para desacoplar el acceso a datos de la lógica de negocio.

## Objetivo del patrón

* Centralizar operaciones CRUD.
* Evitar acceso directo a Prisma desde controladores.
* Facilitar mantenimiento.
* Permitir escalabilidad.
* Facilitar testing.

---

## Repositorios implementados

### CompanyRepository

Maneja operaciones relacionadas con compañías.

### EmployeeRepository

Maneja operaciones relacionadas con empleados.

---

## Métodos principales

```ts
findAll()
findById(id)
create(data)
update(id, data)
delete(id)
```

---

# Unit of Work

El proyecto implementa el patrón Unit of Work para centralizar operaciones transaccionales y coordinar repositorios.

---

## ¿Qué es Unit of Work?

Unit of Work es un patrón de diseño que agrupa múltiples operaciones de base de datos dentro de una sola unidad de trabajo.

Su objetivo principal es:

* Garantizar consistencia.
* Manejar transacciones.
* Confirmar cambios juntos.
* Revertir cambios en caso de error.

---

## ¿Cómo se implementó en esta tecnología?

En el proyecto se implementó mediante una clase `UnitOfWork` que utiliza Prisma.

Ubicación:

```bash
src/application/unit-of-work/
```

El UnitOfWork recibe una instancia de PrismaService y ejecuta transacciones utilizando:

```ts
this.prisma.$transaction()
```

Ejemplo simplificado:

```ts
async execute<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
  return this.prisma.$transaction(callback);
}
```

---

## ¿Cómo se manejan las transacciones?

Las transacciones se manejan mediante el método:

```ts
prisma.$transaction()
```

Todas las operaciones ejecutadas dentro del callback forman parte de la misma transacción.

Si una operación falla:

* Prisma cancela toda la transacción.
* Ningún cambio se guarda.

---

## ¿Cómo se hace commit?

El commit ocurre automáticamente cuando:

* Todas las operaciones finalizan correctamente.
* No se lanza ninguna excepción.

Ejemplo:

```ts
await this.prisma.$transaction(async (tx) => {
  await tx.company.create(...);
  await tx.employee.create(...);
});
```

Si todo termina correctamente, Prisma confirma los cambios automáticamente.

---

## ¿Cómo se hace rollback?

El rollback ocurre automáticamente cuando se produce un error dentro de la transacción.

Ejemplo:

```ts
await this.prisma.$transaction(async (tx) => {
  await tx.company.create(...);

  throw new Error('Error de prueba');
});
```

En este caso:

* Prisma revierte todos los cambios.
* La base de datos permanece consistente.

---

# Endpoints

## Companies

| Método | Endpoint       | Descripción             |
| ------ | -------------- | ----------------------- |
| GET    | /companies     | Obtener compañías       |
| GET    | /companies/:id | Obtener compañía por ID |
| POST   | /companies     | Crear compañía          |
| PUT    | /companies/:id | Actualizar compañía     |
| DELETE | /companies/:id | Eliminar compañía       |

---

## Employees

| Método | Endpoint       | Descripción             |
| ------ | -------------- | ----------------------- |
| GET    | /employees     | Obtener empleados       |
| GET    | /employees/:id | Obtener empleado por ID |
| POST   | /employees     | Crear empleado          |
| PUT    | /employees/:id | Actualizar empleado     |
| DELETE | /employees/:id | Eliminar empleado       |

---

# Endpoint transaccional

El proyecto utiliza operaciones transaccionales mediante UnitOfWork y Prisma.

Ejemplo conceptual:

1. Crear compañía.
2. Crear empleados asociados.
3. Confirmar todos los cambios juntos.

Si alguna operación falla:

* Toda la transacción es revertida.
* No quedan datos inconsistentes.

---

# Instalación

## Clonar repositorio

```bash
git clone <url-del-repositorio>
```

---

## Instalar dependencias

```bash
npm install
```

---

# Configuración de base de datos

Crear archivo:

```bash
.env
```

Ejemplo:

```env
DATABASE_URL="sqlserver://localhost:1433;database=CompanyEmployees;user=sa;password=YourPassword123;trustServerCertificate=true"
```

---

# Migraciones

## Generar migración

```bash
npx prisma migrate dev --name init
```

---

## Generar cliente Prisma

```bash
npx prisma generate
```

---

# Ejecución del proyecto

## Desarrollo

```bash
npm run start:dev
```

---

## Producción

```bash
npm run build
npm run start:prod
```

---

# Pruebas con Swagger/Postman

La documentación Swagger se encuentra disponible en:

```bash
http://localhost:3000/api
```

Desde Swagger se pueden:

* Probar endpoints.
* Visualizar DTOs.
* Revisar respuestas.
* Ejecutar operaciones CRUD.

También es posible probar la API usando Postman.

---

# Logging

El proyecto implementa logging mediante Winston.

Objetivos:

* Registrar errores.
* Monitorear operaciones.
* Facilitar debugging.
* Mantener trazabilidad.

El sistema de logging se encuentra centralizado en:

```bash
src/common/logging/
```

---

# Uso de IA

Durante el desarrollo del proyecto se utilizaron herramientas de inteligencia artificial como apoyo técnico.

La IA fue utilizada para:

* Resolver dudas técnicas.
* Explicar patrones de diseño.
* Optimizar estructura del proyecto.
* Generar documentación.
* Comprender errores.

Sin embargo:

* La lógica fue validada manualmente.
* La arquitectura fue adaptada al proyecto.
* El código fue revisado y corregido.

---

# Conclusiones

El proyecto permitió aplicar conceptos modernos de desarrollo backend utilizando NestJS y Onion Architecture.

Principales aprendizajes:

* Separación de responsabilidades.
* Implementación de Repository Pattern.
* Manejo de transacciones con UnitOfWork.
* Uso de Prisma ORM.
* Diseño de APIs REST.
* Organización escalable de proyectos.

La arquitectura utilizada mejora:

* mantenibilidad,
* legibilidad,
* escalabilidad,
* desacoplamiento del sistema.

Además, el uso de transacciones mediante Prisma garantiza consistencia en las operaciones de base de datos.
