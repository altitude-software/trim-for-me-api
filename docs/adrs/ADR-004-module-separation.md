# ADR-004: Separación en módulos users/job-offers

- **Estado:** Propuesto
- **Fecha:** 2026-04-07
- **Autor(es):** José Manuel Cornejo Lupa
- **Revisor(es):**

---

## Contexto

Definir el alcance y límites del sistema en la primera iteración de trabajo.

## Decisión

Dos móudlos independientes, cada uno respeta el patrón de arquitectura propuesto hexagonal. (domain-application-infrastructure)

## Alternativas consideradas

| Alternativa | Motivo de descarte |
|-------------|-------------------|
| Módulo monolítico | Mezcla contextos distintos en un solo lugar; genera acoplamiento implícito difícil de controlar a medida que el proyecto crece.|
| Separación por capa técnica | Estructura orientada a tecnología, no al negocio; dificulta aplicar hexagonal y obliga a navegar múltiples carpetas para una sola funcionalidad. |

## Consecuencias

### Ventajas
- Cada módulo es autónomo, esto facilita escalar a microservicios en el futuro.
- Se muestran límites de responsabilidad claros.

### Desventajas / Trade-offs
- Duplicación de estructura.
- La comunicación entre módulos requiere una disciplina ya que no pueden existir imports directos entre dominios.

### Implicaciones futuras
Cuidar siempre imports directos entre dominios.

---

> Si esta decisión cambia, no modificar este documento.
> Crear un nuevo ADR que lo superceda y actualizar el estado a "Superado por ADR-XXX".