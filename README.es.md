# Repaso

Práctica gratis para entrevistas de ingeniería de software, de nivel junior a intermedio, en inglés y español.

**https://babylonace.github.io/repaso/**

[Read in English](README.md)

777 preguntas y 745 términos de glosario en 14 temas: Python, Java, Spring, SQL, algoritmos, diseño de sistemas, seguridad, frontend, cloud, Git, testing y preguntas de comportamiento.

Entras y la primera pregunta ya está ahí. Sin registro, sin anuncios, sin rastreadores. Tu progreso se queda en tu navegador y funciona sin conexión después de la primera visita. Si lo quieres en otro dispositivo puedes iniciar sesión con Google o GitHub, pero nada depende de eso.

## Cómo funciona

- Las preguntas que fallas vuelven antes. Las que sabes vuelven más tarde (cinco cajas, estilo Leitner, de 0 a 16 días).
- Cada tema tiene cuatro niveles. Un nivel se abre cuando aciertas el 70% del anterior.
- La búsqueda de la portada cubre preguntas, glosario y temas, en los dos idiomas.
- El modo Estudiar te deja leerlo todo sin que te pregunten nada.

## ¿Encontraste un error?

Es bastante posible. Las preguntas y la traducción son AI-assisted, así que por favor avísame. Cada pregunta tiene un enlace "Sugerir una corrección" que abre un issue ya rellenado aquí.

Si quieres arreglarlo tú, el contenido es JSON normal:

- `content/questions/<tema>.json`: las preguntas en inglés. Cada una tiene un `id` estable.
- `content/es/questions/<tema>.json`: la versión en español, por `id`. El código se queda en inglés.
- `content/glossary.json` y `content/es/glossary.json`: el glosario.

`npm test` lo comprueba todo: ids, respuestas, enlaces al glosario y que una traducción no cambie nada de código.

## Ejecutarlo en local

Necesitas Node 22 o superior. No hay dependencias que instalar.

```bash
npm run serve   # construye y sirve en http://localhost:4173
npm test        # tests de lógica y contenido
```

## Licencia

Código: [MIT](LICENSE). Preguntas y glosario: [CC BY 4.0](content/LICENSE.md). Fuentes: SIL Open Font License, incluida junto a los archivos de las fuentes.

AI-assisted.
