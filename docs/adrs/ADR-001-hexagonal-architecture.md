# ADR-001: Arquitectura Hexagonal

- **Estado:** Propuesto
- **Fecha:** 2026-04-06
- **Autor(es):** José Manuel Cornejo Lupa
- **Revisor(es):** Angel Jose Sucapuca Diaz

---

## Contexto

Existe una necesidad de seprar la la lógica del negocio de frameworks/infraestructura para que pueda ser reutilizable con otros frameworks.

## Decisión

Se usarán puertos y adaptadores con capas distinguibles las cuales son domain-application-infrastructure.

## Alternativas consideradas

| Alternativa | Motivo de descarte |
|-------------|-------------------|
| MVC         | Este patrón termina mezclando lógica de negocio con acceso a datos. Puede terminar acoplado el ORM o framework de forma nativa.               |
| Clean arquitecture| Comparte los mismos objetivos que Hexagonal. Pero incluye otras capas innecesarias esta pensado para un proyecto más grande con mas personas.|

## Consecuencias

### Ventajas
- La capa del dominio se puede testear sin necesidad de dependencias extras.
- Es muy fácil de cambiar de ORMs o frameworks sin necesidad de romper con la lógica del negocio.

### Desventajas / Trade-offs
- Curva de aprendizaje un poco compleja.
- Se puede car en un over'engineering para proyectos pequeños.

### Implicaciones futuras
Al estar todo dividido en capas distintivas se debe tener manejo en el patrón hexagonal para saber en que capa se deben hacer cambios cuando se quiere realizar un ajuste en la aplicación.

---

> Si esta decisión cambia, no modificar este documento.
> Crear un nuevo ADR que lo superceda y actualizar el estado a "Superado por ADR-XXX".