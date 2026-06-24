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

## CRUD de colecciones

Se implementaron operaciones sobre colecciones para complementar el CRUD individual existente.

### Paginación, filtrado y ordenamiento

Se añadió soporte para paginación, búsqueda y ordenamiento dinámico en los endpoints de consulta de empleados.

Parámetros soportados:

* `page`: número de página.
* `size`: cantidad de registros por página.
* `search`: texto utilizado para filtrar empleados por nombre, apellido o correo.
* `orderBy`: campo por el cual ordenar los resultados.
* `direction`: dirección del ordenamiento (`asc` o `desc`).

Ejemplo:

```http
GET /employees?page=1&size=10&search=juan&orderBy=apellido&direction=asc
```

También se implementaron operaciones sobre colecciones:

* Creación masiva de empleados (`POST /employees/lote`)
* Actualización parcial (`PATCH /employees/{id}`)
* Eliminación múltiple (`DELETE /employees/lote`)

---

## Programación asíncrona

### ¿Mi tecnología soporta async? (sí/no y por qué)

Sí.

NestJS soporta programación asíncrona de forma nativa mediante `async/await`, mientras que Prisma ORM retorna Promesas para todas las operaciones de acceso a datos.

Esto permite atender múltiples solicitudes concurrentes sin bloquear el hilo de ejecución mientras se esperan operaciones de entrada/salida, como consultas a la base de datos.

### Qué se refactorizó (o alternativa aplicada)

Los servicios, repositorios y el Unit of Work fueron implementados utilizando métodos asíncronos desde el inicio del proyecto.

Se empleó `async/await` en:

* Servicios de aplicación.
* Repositorios.
* Operaciones transaccionales del Unit of Work.
* Endpoints expuestos por los controladores.

---

## Validaciones

### Librería usada y reglas aplicadas

Se utilizó la librería `class-validator` junto con `ValidationPipe` de NestJS.

Reglas implementadas:

**Compañía**

* Nombre obligatorio.
* Longitud entre 3 y 100 caracteres.
* Teléfono obligatorio y compuesto únicamente por dígitos.

**Empleado**

* Nombre obligatorio.
* Apellido obligatorio.
* Correo electrónico con formato válido.
* Salario mayor a cero.
* La compañía asociada debe existir.
* El correo electrónico debe ser único.

Cuando una validación falla, la API responde con código HTTP `400 Bad Request` indicando los campos inválidos.

---

## Pruebas

### Cómo ejecutar las pruebas

Ejecutar todas las pruebas:

```bash
npm test
```

Ejecutar pruebas unitarias:

```bash
npm run test
```

Ejecutar pruebas e2e:

```bash
npm run test:e2e
```

### Prueba del rollback transaccional

Se implementó una prueba para verificar el comportamiento transaccional del Unit of Work.

La prueba intenta crear una compañía junto con varios empleados, donde uno de ellos contiene información inválida.

Se comprobó que, al producirse un error, la transacción realiza un rollback y no se almacena ni la compañía ni ninguno de sus empleados.

---

## Seguridad

### Autenticación con JWT

Se implementó autenticación basada en JSON Web Tokens utilizando:

* `@nestjs/jwt`
* `passport-jwt`
* `bcrypt`

Endpoints disponibles:

```http
POST /auth/register
POST /auth/login
GET /auth/profile
```

Las contraseñas se almacenan utilizando hashing mediante bcrypt.

---

### Autorización por roles

Se implementó autorización basada en roles mediante:

* `JwtAuthGuard`
* `RolesGuard`
* Decorador `@Roles()`

Roles disponibles:

* ADMIN
* USER

Restricciones aplicadas:

* Solo ADMIN puede eliminar recursos.
* Los endpoints protegidos requieren un token JWT válido.

---

### Autorización por políticas (policies)

Se implementó una política de propiedad sobre empleados.

Un usuario con rol USER únicamente puede modificar empleados pertenecientes a su propia compañía.

Los usuarios con rol ADMIN no tienen esta restricción.

La evaluación de esta regla se realiza mediante `EmployeePolicyService`.

---

## Variables de entorno (clave secreta JWT, conexión, etc.)

Ejemplo de archivo `.env`

```env
DATABASE_URL="sqlserver://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
PORT=3000
```

---

## Comparación ampliada con ASP.NET Core

| Concepto en ASP.NET Core           | Equivalente en NestJS      |
| ---------------------------------- | -------------------------- |
| IEnumerable / List                 | Array<T>                   |
| Skip() / Take()                    | skip / take de Prisma      |
| async / await + Task<T>            | async / await + Promise<T> |
| DataAnnotations                    | class-validator            |
| xUnit / NUnit + Moq                | Jest                       |
| AddAuthentication().AddJwtBearer() | Passport JWT               |
| [Authorize(Roles="...")]           | RolesGuard + @Roles()      |
| [Authorize(Policy="...")]          | EmployeePolicyService      |
| ClaimsPrincipal                    | request.user               |
| Entity Framework                   | Prisma ORM                 |

---

## Conclusiones de la Parte II

La segunda parte del proyecto permitió evolucionar la API hacia una solución más cercana a un entorno productivo.

Se incorporaron operaciones sobre colecciones, programación asíncrona, validaciones centralizadas, pruebas automatizadas y mecanismos avanzados de seguridad mediante JWT, roles y políticas.

La implementación de Onion Architecture, Repository Pattern y Unit of Work facilitó mantener una clara separación de responsabilidades y permitió agregar nuevas funcionalidades sin afectar significativamente las capas existentes.

El uso de Prisma ORM y NestJS proporcionó una solución moderna, escalable y mantenible para el desarrollo de APIs empresariales.

