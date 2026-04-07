# ADR-003: TypeORM + PostgreSQL

- **Estado:** Propuesto
- **Fecha:** 2026-04-06
- **Autor(es):** José Manuel Cornejo Lupa
- **Revisor(es):**

---

## Contexto

Necesidad de persitencia en una base de datos relacional que tenga soporte a TypeScript.

## Decisión

TypeORM como ORM, PostgreSQL como motor de base de datos. Se decidió ir por PostgreSQL por decisión de la gerencia.
**Nota Importante**: se puede ver el ERD relacionado con este ADR en la carpeta /diagrams .

## Alternativas consideradas

| Alternativa | Motivo de descarte |
|-------------|-------------------|
| Prisma    | Su esquema como fuente de verdad acopla las entidades  al ORM, rompiendo el aislamiento del dominio en hexagonal. |
| MikroORM  | Técnicamente sólido pero comunidad pequeña y escasa documentación de integración con NestJS.                   |
| Drizzle   | Ecosistema inmaduro, sin integración oficial con NestJS y orientado a SQL puro, poco natural con repositorios.     |

## Consecuencias

### Ventajas
- Integración nativa con NestJS.
- Decoradores ya en Typescript.
- Soporte a migraciones.

### Desventajas / Trade-offs
- Prisma tiene mejores DX actualmente.
- Algunos conceptos técnicos como active record vs data mapper puede llegar a la confusión del desarrollador.

### Implicaciones futuras
La infraestructura de PostgreSQL debe ser desarrollada de la mano con TypeORM.

---

> Si esta decisión cambia, no modificar este documento.
> Crear un nuevo ADR que lo superceda y actualizar el estado a "Superado por ADR-XXX".