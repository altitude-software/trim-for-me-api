# ADR-002: NestJS + Typescript

- **Estado:** Propuesto
- **Fecha:** 2026-04-06
- **Autor(es):** José Manuel Cornejo Lupa
- **Revisor(es):** Angel Jose Sucapuca Diaz

---

## Contexto

Se necesita un framework backend que soporte la mayoría de funcionalidades y separaciones que propone hexagonal además que debe ser tipado el lenguaje de programación.

## Decisión

NestJS como framework, Typescript como lenguaje de programación

## Alternativas consideradas

| Alternativa | Motivo de descarte |
|-------------|-------------------|
| Express puro         |No tiene DI (Dependency Inyection) ni módulos nativos; construir esa estructura manualmente anula la ventaja de usarlo.|
| Fastify         |Más rápido pero sin DI ni módulos estructurados; ecosistema insuficiente para arquitecturas complejas.|
| Hapi         | Comunidad reducida, adopción en declive, alta curva de aprendizaje sin ventajas que justifiquen el esfuerzo.|

## Consecuencias

### Ventajas
- Inyección de dependencias rápida y built-in.
- Decoradores.
- Framework ya enfocado en módulos.
- Ecosistema maduro.

### Desventajas / Trade-offs
- La abstracción sobre Express puede ocultar comportamientos.
- Bundle pesado comparado a otras opciones.

### Implicaciones futuras
Al usar dependencias se debe comprobar su compatibilidad con NestJS y sus principales dependencias de Node.
El lenguaje de programación como Typescript marca fuertemente el manejo del proyecto, no puede existir código sin tipar.

---

> Si esta decisión cambia, no modificar este documento.
> Crear un nuevo ADR que lo superceda y actualizar el estado a "Superado por ADR-XXX".