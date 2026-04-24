# ADR-000: [Título corto de la decisión]

- **Estado:** Propuesto
- **Fecha:** 2026-04-13
- **Autor(es):** José Manuel Cornejo Lupa
- **Revisor(es):** Angel Jose Sucapuca Diaz

---

## Contexto

El proyecto expone una API REST y se necesita una forma de documentar los endpoints que sea mantenible, accesible y que no quede desactualizada con el tiempo.

## Decisión

Usar @nestjs/swagger para generar documentación OpenAPI automática a partir de decoradores en los controladores y DTOs. Disponible en /api/docs en entorno de desarrollo.

## Alternativas consideradas

| Alternativa | Motivo de descarte |
|-------------|-------------------|
|Markdown manual| Se desactualiza inevitablemente — nadie recuerda actualizar el .md cuando cambia un DTO.|
|Postman Collection como única fuente| Es una herramienta de pruebas, no de documentación — no es accesible sin instalar Postman y no comunica contratos de forma clara.|
|Redoc|Es solo un renderizador de OpenAPI, no genera la especificación — seguiría necesitando @nestjs/swagger por detrás, añadiendo una capa innecesaria.|

## Consecuencias

### Ventajas

- La documentación vive junto al código — si cambia un DTO, el decorador se actualiza en el mismo lugar
- UI interactiva para probar endpoints sin herramientas externas
- Integración oficial con NestJS, sin configuración compleja
- Genera un archivo openapi.json exportable si se necesita en el futuro

### Desventajas / Trade-offs

- Los controladores y DTOs acumulan decoradores de Swagger que añaden ruido visual
- Requiere disciplina para mantener los decoradores actualizados y descriptivos

### Implicaciones futuras
- Todo nuevo endpoint o DTO debe incluir sus decoradores Swagger como parte del contrato
- El archivo openapi.json puede usarse para generar clientes TypeScript en el frontend en el futuro

---

> Si esta decisión cambia, no modificar este documento.
> Crear un nuevo ADR que lo superceda y actualizar el estado a "Superado por ADR-XXX".