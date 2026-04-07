# ADR-005: Value Objects Email y Uuid

- **Estado:** Propuesto
- **Fecha:** 2026-04-07
- **Autor(es):** José Manuel Cornejo Lupa
- **Revisor(es):**

---

## Contexto

En estos campos email y el identificador de objetos el tipo primitivo string no expresan una intención y la validación en dominio puede ser invariante.

## Decisión

Crear Value objects para cada uno de estos campos, Email con validación de formato en el módulo de users, Uuid compartido en /shared/domain, ya que es un tipo que se comparte a través de los módulos.

## Alternativas consideradas

| Alternativa | Motivo de descarte |
|-------------|-------------------|
| Validar en DTOs con class-validator | La validación queda en capa de aplicación; el dominio puede recibir valores inválidos si se accede sin pasar por el DTO.|
| Tipos primitivos con comentarios    | El compilador no garantiza ningún contrato; la validación queda como responsabilidad informal del desarrollador en cada uso.|

## Consecuencias

### Ventajas
- Validación centralizada en la capa de dominio, como una regla de dominio.
- Expresividad del dominio, se lee mucho mejor el código.
- Imposible de construir un Email inválido.

### Desventajas / Trade-offs
- Más clases que tener en cuenta.
- Conversión a tipos primitivos necesaria en la capa de infraestructura a través de mappers.

### Implicaciones futuras
Este ADR demuestra que para ciertos campos se podrían anadir VO (Value Objects) como tipos especializados que requieran validación interna como parte de la capa de dominio/negocio.

---

> Si esta decisión cambia, no modificar este documento.
> Crear un nuevo ADR que lo superceda y actualizar el estado a "Superado por ADR-XXX".