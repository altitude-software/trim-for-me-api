# ERD — Diagrama Entidad-Relación

Este documento describe la estructura de la base de datos del proyecto **trim-for-me-api**. El diagrama está escrito en sintaxis **Mermaid** y representa todas las tablas y relaciones del sistema.

---

## Cómo visualizar el diagrama

El archivo `ERD.md` contiene el código Mermaid del diagrama. Puedes renderizarlo de las siguientes formas:

| Método | Instrucciones |
|--------|--------------|
| **GitHub / GitLab** | Abre el archivo `ERD.md` directamente en el repositorio. Se renderiza automáticamente. |
| **VS Code** | Instala la extensión [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid), luego abre `ERD.md` y activa la vista previa con `Ctrl+Shift+V`. |
| **Online** | Copia el bloque de código Mermaid y pégalo en [https://mermaid.live](https://mermaid.live). |

---

## Tablas del sistema

| Tabla | Descripción |
|-------|-------------|
| `USER` | Representa a todos los usuarios de la plataforma. Un usuario puede ser creador de contenido o editor de video, distinguido por el campo `role`. |
| `JOB_OFFER` | Representa una oferta de trabajo publicada por un creador. Es el aggregate root principal del sistema. |
| `MATERIAL` | Archivos o recursos adjuntos a una oferta (videos de referencia, guías, ejemplos). Una oferta puede tener múltiples materiales. |
| `VIDEO_FORMAT` | Especificaciones técnicas del video que se desea editar: orientación y duración. Cada oferta tiene exactamente un formato. |
| `EDIT_LEVEL` | Nivel de complejidad de edición requerido para la oferta: básico, intermedio o avanzado. Cada oferta tiene exactamente un nivel. |
| `COMPENSATION` | Condiciones de pago de la oferta: tipo de compensación, monto, duración y moneda. Cada oferta tiene exactamente una compensación. |

---

## Relaciones

- Un **USER** puede publicar muchas **JOB_OFFER**, pero cada oferta pertenece a un único creador.
- Una **JOB_OFFER** puede tener muchos **MATERIAL** adjuntos.
- Una **JOB_OFFER** tiene exactamente un **VIDEO_FORMAT**, un **EDIT_LEVEL** y una **COMPENSATION**.

---

## Notas de diseño

**Tablas CREATOR y EDITOR eliminadas**
En una versión anterior del diseño existían tablas separadas para creadores y editores. Se descartaron en favor de una única tabla `USER` con un campo `role` (`creator | editor`). Esto simplifica la autenticación y evita duplicación de lógica de usuarios.

**Campos nullable**
- `USER.name` — el nombre es opcional en el registro inicial.
- `JOB_OFFER.description` — una oferta puede crearse sin descripción y completarse después.
- `MATERIAL.description` — los materiales pueden adjuntarse sin descripción explicativa.
- `VIDEO_FORMAT.technical_format` — el formato técnico específico (ej: H.264, ProRes) es opcional.
- `COMPENSATION.duration_in_minutes` y `COMPENSATION.amount` y `COMPENSATION.currency` — son opcionales cuando el tipo de compensación es `negotiable`.

---

## Referencias

- Decisión de base de datos y ORM → [`ADR-003: TypeORM + PostgreSQL`](./ADR-003-typeorm-postgresql.md)
- Diagrama completo → [`ERD.md`](./ERD.md)