# Prompts for the content chats

Ready to paste, one per new Claude Code chat opened in this repo. Each prompt is self-contained. The plan, the reasoning and the quality bar are in [content-plan.md](content-plan.md). Do them in this order, ideally one at a time, merging into `main` between chats so they do not clash on `content/topics.json` and `public/assets/js/icons.js`.

Each chat writes its sources to `docs/sources/<topic>.md`. The [monthly report](monthly-agent.md) checks that these links still answer, and they are where to start when re-checking content that ages.

Order and why: AI, Data and Cloud first (most asked), then Languages and Web, then CS, QA and Mobile, then Embedded (a niche where few free bilingual sites exist), then Team plus the final review.

## 1. repaso-ai: IA y aprendizaje automático (nueva categoría)

```
Trabajo en Repaso, en la carpeta de este repo. Antes de nada lee docs/content-plan.md (árbol, "Quality bar" y "How to add a category and its topics") y docs/maintenance.md (sección "Adding content"). Mira también 2 o 3 preguntas de temas ya existentes parecidos para copiar el esquema de los campos (content/questions/*.json) y el estilo.
El alcance ya está confirmado aquí: empieza sin preguntas previas, salvo un bloqueo real.

CÓMO TRABAJAR
- Un tema cada vez, en el orden indicado. Por tema: (1) investiga qué se pregunta hoy en entrevistas (guías recientes de entrevistas y documentación oficial); (2) escribe unas 40 preguntas: ~6 de nivel 0, ~12 de nivel 1, ~14 de nivel 2, ~8 de nivel 3, y alrededor de una de cada diez como flashcard (t:"f"); (3) verifica cada dato con documentación oficial o la especificación; (4) guarda las fuentes en docs/sources/<k>.md (una línea por fuente, con URL y qué dato respalda: el agente mensual las usará para revisar contenido que envejece); (5) añade los términos nuevos a content/glossary.json; (6) traduce al español con npm run i18n -- todo / apply; (7) npm test; (8) commit local de ese tema.
- Calidad: cuatro opciones, una correcta y tres que un candidato medio preparado elegiría de verdad; nada de "todas las anteriores" ni opciones de broma; la explicación dice por qué la correcta lo es y por qué falla la opción más tentadora. Incluye preguntas de escenario ("una consulta se volvió lenta", "el pod se reinicia"), no solo definiciones. Cualquier dato ligado a una versión nombra la versión. Evita nombres de modelos, precios y cuotas que caducan rápido: pregunta por conceptos.
- Español: traducción real, mismos code spans, misma estructura de líneas, sin rayas largas. Términos que en español se dicen en inglés (deploy, commit, pull request) se quedan en inglés.
- Si la categoría es nueva: añádela a content/groups.json al llegar su primer tema (el validador rechaza categorías vacías). Cada tema nuevo: entrada en content/topics.json con k, g, name, name_es y p; ids nuevos PREFIJO-01, PREFIJO-02..., nunca reutilizados; un icono 24x24 de trazo en public/assets/js/icons.js (P) y un matiz en HUE, o saldrá el icono de reloj de reserva.
- Al terminar todos los temas: npm run e2e (Playwright está en %TEMP%\pw\node_modules: cópialo con cp -r a ./node_modules y bórralo con rm -rf al acabar, porque el repo está en OneDrive), actualiza las cifras y la tabla por tema de README.md y README.es.md y ejecuta npm run media.
- Si el chat se queda sin contexto: haz commit de lo hecho, y deja en la última línea del informe qué tema y nivel faltan para que otro chat continúe.

REGLAS
- Commits solo locales. Autor 344108195+babylonace@users.noreply.github.com. Sin línea de coautor ni mención de IA en los commits. NO hagas push hasta que yo diga sí.
- Textos públicos con voz directa y sencilla, sin tópicos ni datos inventados.
- No toques .github/, firebase/ ni la configuración de cuentas.

AL FINAL
Dime: preguntas añadidas por tema y nivel, qué datos te dejan dudas de veracidad, qué solapa con temas existentes, y propón (sin escribirla todavía) la actualización del vault: nota proyecto-repaso, líneas a añadir y entrada para log.md.

TAREA ESPECÍFICA
Categoría nueva: g="ai", name "AI & machine learning", name_es "IA y aprendizaje automático".
Temas, en este orden:
1. ml, prefijo ML: "ML fundamentals" / "Fundamentos de ML". Sesgo y varianza, sobreajuste, regularización, métricas (precisión, recall, F1, ROC-AUC y cuándo engañan), fuga de datos, validación cruzada, árboles y ensembles, selección de variables, desbalance de clases, evaluación en producción.
2. llm, prefijo LLM: "LLMs, RAG & agents" / "LLMs, RAG y agentes". Tokens y ventana de contexto, prompting, embeddings, chunking, RAG y cómo evaluarlo, tool use, agentes y sus fallos, inyección de prompts, alucinaciones, evals, guardarraíles, coste y latencia, diseño de sistemas con IA. Conceptos neutros respecto al proveedor; documentación oficial de los proveedores solo para hechos concretos.
3. mlops, prefijo MLO (prioridad baja, hazlo si queda contexto): "MLOps & serving" / "MLOps y despliegue". Pipelines, drift, monitorización, feature stores, despliegue y versionado de modelos.
```

## 2. repaso-data: Datos (se añade a la categoría que ya existe)

```
Trabajo en Repaso, en la carpeta de este repo. Antes de nada lee docs/content-plan.md (árbol, "Quality bar" y "How to add a category and its topics") y docs/maintenance.md (sección "Adding content"). Mira también 2 o 3 preguntas de temas ya existentes parecidos para copiar el esquema de los campos (content/questions/*.json) y el estilo.
El alcance ya está confirmado aquí: empieza sin preguntas previas, salvo un bloqueo real.

CÓMO TRABAJAR
- Un tema cada vez, en el orden indicado. Por tema: (1) investiga qué se pregunta hoy en entrevistas (guías recientes de entrevistas y documentación oficial); (2) escribe unas 40 preguntas: ~6 de nivel 0, ~12 de nivel 1, ~14 de nivel 2, ~8 de nivel 3, y alrededor de una de cada diez como flashcard (t:"f"); (3) verifica cada dato con documentación oficial o la especificación; (4) guarda las fuentes en docs/sources/<k>.md (una línea por fuente, con URL y qué dato respalda: el agente mensual las usará para revisar contenido que envejece); (5) añade los términos nuevos a content/glossary.json; (6) traduce al español con npm run i18n -- todo / apply; (7) npm test; (8) commit local de ese tema.
- Calidad: cuatro opciones, una correcta y tres que un candidato medio preparado elegiría de verdad; nada de "todas las anteriores" ni opciones de broma; la explicación dice por qué la correcta lo es y por qué falla la opción más tentadora. Incluye preguntas de escenario ("una consulta se volvió lenta", "el pod se reinicia"), no solo definiciones. Cualquier dato ligado a una versión nombra la versión. Evita nombres de modelos, precios y cuotas que caducan rápido: pregunta por conceptos.
- Español: traducción real, mismos code spans, misma estructura de líneas, sin rayas largas. Términos que en español se dicen en inglés (deploy, commit, pull request) se quedan en inglés.
- Si la categoría es nueva: añádela a content/groups.json al llegar su primer tema (el validador rechaza categorías vacías). Cada tema nuevo: entrada en content/topics.json con k, g, name, name_es y p; ids nuevos PREFIJO-01, PREFIJO-02..., nunca reutilizados; un icono 24x24 de trazo en public/assets/js/icons.js (P) y un matiz en HUE, o saldrá el icono de reloj de reserva.
- Al terminar todos los temas: npm run e2e (Playwright está en %TEMP%\pw\node_modules: cópialo con cp -r a ./node_modules y bórralo con rm -rf al acabar, porque el repo está en OneDrive), actualiza las cifras y la tabla por tema de README.md y README.es.md y ejecuta npm run media.
- Si el chat se queda sin contexto: haz commit de lo hecho, y deja en la última línea del informe qué tema y nivel faltan para que otro chat continúe.

REGLAS
- Commits solo locales. Autor 344108195+babylonace@users.noreply.github.com. Sin línea de coautor ni mención de IA en los commits. NO hagas push hasta que yo diga sí.
- Textos públicos con voz directa y sencilla, sin tópicos ni datos inventados.
- No toques .github/, firebase/ ni la configuración de cuentas.

AL FINAL
Dime: preguntas añadidas por tema y nivel, qué datos te dejan dudas de veracidad, qué solapa con temas existentes, y propón (sin escribirla todavía) la actualización del vault: nota proyecto-repaso, líneas a añadir y entrada para log.md.

TAREA ESPECÍFICA
La categoría g="data" ya existe (tiene db). NO la crees de nuevo: añade temas a ella.
Temas, en este orden:
1. nosql, prefijo NOSQL: "NoSQL & caching" / "NoSQL y caché". Documento, clave-valor, columnas anchas, grafos, Redis, teorema CAP, consistencia eventual, particionado, estrategias de caché e invalidación. Lee content/questions/db.json antes para no duplicar lo que ya cubre (hay preguntas de Redis y de réplicas).
2. de, prefijo DE: "Data engineering" / "Ingeniería de datos". Pipelines, ETL frente a ELT, almacenes de datos, modelado dimensional, Spark, Kafka, orquestación, calidad de datos, batch frente a streaming, idempotencia, particionado de ficheros.
3. da, prefijo DA: "Data analysis & BI" / "Análisis de datos y BI". Estadística básica, pruebas A/B y sus trampas, pandas, SQL analítico (ventanas), métricas y KPIs, visualización y dashboards, sesgos en el análisis.
```

## 3. repaso-cloud: Cloud y DevOps (se añade a la categoría que ya existe)

```
Trabajo en Repaso, en la carpeta de este repo. Antes de nada lee docs/content-plan.md (árbol, "Quality bar" y "How to add a category and its topics") y docs/maintenance.md (sección "Adding content"). Mira también 2 o 3 preguntas de temas ya existentes parecidos para copiar el esquema de los campos (content/questions/*.json) y el estilo.
El alcance ya está confirmado aquí: empieza sin preguntas previas, salvo un bloqueo real.

CÓMO TRABAJAR
- Un tema cada vez, en el orden indicado. Por tema: (1) investiga qué se pregunta hoy en entrevistas (guías recientes de entrevistas y documentación oficial); (2) escribe unas 40 preguntas: ~6 de nivel 0, ~12 de nivel 1, ~14 de nivel 2, ~8 de nivel 3, y alrededor de una de cada diez como flashcard (t:"f"); (3) verifica cada dato con documentación oficial o la especificación; (4) guarda las fuentes en docs/sources/<k>.md (una línea por fuente, con URL y qué dato respalda: el agente mensual las usará para revisar contenido que envejece); (5) añade los términos nuevos a content/glossary.json; (6) traduce al español con npm run i18n -- todo / apply; (7) npm test; (8) commit local de ese tema.
- Calidad: cuatro opciones, una correcta y tres que un candidato medio preparado elegiría de verdad; nada de "todas las anteriores" ni opciones de broma; la explicación dice por qué la correcta lo es y por qué falla la opción más tentadora. Incluye preguntas de escenario ("una consulta se volvió lenta", "el pod se reinicia"), no solo definiciones. Cualquier dato ligado a una versión nombra la versión. Evita nombres de modelos, precios y cuotas que caducan rápido: pregunta por conceptos.
- Español: traducción real, mismos code spans, misma estructura de líneas, sin rayas largas. Términos que en español se dicen en inglés (deploy, commit, pull request) se quedan en inglés.
- Si la categoría es nueva: añádela a content/groups.json al llegar su primer tema (el validador rechaza categorías vacías). Cada tema nuevo: entrada en content/topics.json con k, g, name, name_es y p; ids nuevos PREFIJO-01, PREFIJO-02..., nunca reutilizados; un icono 24x24 de trazo en public/assets/js/icons.js (P) y un matiz en HUE, o saldrá el icono de reloj de reserva.
- Al terminar todos los temas: npm run e2e (Playwright está en %TEMP%\pw\node_modules: cópialo con cp -r a ./node_modules y bórralo con rm -rf al acabar, porque el repo está en OneDrive), actualiza las cifras y la tabla por tema de README.md y README.es.md y ejecuta npm run media.
- Si el chat se queda sin contexto: haz commit de lo hecho, y deja en la última línea del informe qué tema y nivel faltan para que otro chat continúe.

REGLAS
- Commits solo locales. Autor 344108195+babylonace@users.noreply.github.com. Sin línea de coautor ni mención de IA en los commits. NO hagas push hasta que yo diga sí.
- Textos públicos con voz directa y sencilla, sin tópicos ni datos inventados.
- No toques .github/, firebase/ ni la configuración de cuentas.

AL FINAL
Dime: preguntas añadidas por tema y nivel, qué datos te dejan dudas de veracidad, qué solapa con temas existentes, y propón (sin escribirla todavía) la actualización del vault: nota proyecto-repaso, líneas a añadir y entrada para log.md.

TAREA ESPECÍFICA
La categoría g="cloud" ya existe (tiene ops, con 95 preguntas que ya cubren Docker, Kubernetes, CI/CD y nociones de cloud). NO la crees de nuevo ni dividas ops. Lee content/questions/ops.json entero antes para no solapar.
Temas, en este orden:
1. sre, prefijo SRE: "SRE & observability" / "SRE y observabilidad". SLI y SLO, presupuestos de error, gestión de incidentes y postmortems, logs métricas y trazas, alertas útiles, capacidad, fiabilidad en el diseño. Muchas preguntas de escenario ("cómo falla este sistema").
2. iac, prefijo IAC: "Infrastructure as code" / "Infraestructura como código". Terraform (estado, drift, módulos, planes), Ansible, GitOps, entornos, gestión de secretos en IaC.
3. cprov, prefijo CLD: "Cloud providers" / "Proveedores cloud". AWS primero, con los equivalentes de Azure y GCP: IAM, redes y VPC, almacenamiento, serverless, bases de datos gestionadas, costes. Evita precios y cuotas concretos.
```

## 4. repaso-lang-web: Lenguajes y web (se añade a las categorías que ya existen)

```
Trabajo en Repaso, en la carpeta de este repo. Antes de nada lee docs/content-plan.md (árbol, "Quality bar" y "How to add a category and its topics") y docs/maintenance.md (sección "Adding content"). Mira también 2 o 3 preguntas de temas ya existentes parecidos para copiar el esquema de los campos (content/questions/*.json) y el estilo.
El alcance ya está confirmado aquí: empieza sin preguntas previas, salvo un bloqueo real.

CÓMO TRABAJAR
- Un tema cada vez, en el orden indicado. Por tema: (1) investiga qué se pregunta hoy en entrevistas (guías recientes de entrevistas y documentación oficial); (2) escribe unas 40 preguntas: ~6 de nivel 0, ~12 de nivel 1, ~14 de nivel 2, ~8 de nivel 3, y alrededor de una de cada diez como flashcard (t:"f"); (3) verifica cada dato con documentación oficial o la especificación; (4) guarda las fuentes en docs/sources/<k>.md (una línea por fuente, con URL y qué dato respalda: el agente mensual las usará para revisar contenido que envejece); (5) añade los términos nuevos a content/glossary.json; (6) traduce al español con npm run i18n -- todo / apply; (7) npm test; (8) commit local de ese tema.
- Calidad: cuatro opciones, una correcta y tres que un candidato medio preparado elegiría de verdad; nada de "todas las anteriores" ni opciones de broma; la explicación dice por qué la correcta lo es y por qué falla la opción más tentadora. Incluye preguntas de escenario ("una consulta se volvió lenta", "el pod se reinicia"), no solo definiciones. Cualquier dato ligado a una versión nombra la versión. Evita nombres de modelos, precios y cuotas que caducan rápido: pregunta por conceptos.
- Español: traducción real, mismos code spans, misma estructura de líneas, sin rayas largas. Términos que en español se dicen en inglés (deploy, commit, pull request) se quedan en inglés.
- Si la categoría es nueva: añádela a content/groups.json al llegar su primer tema (el validador rechaza categorías vacías). Cada tema nuevo: entrada en content/topics.json con k, g, name, name_es y p; ids nuevos PREFIJO-01, PREFIJO-02..., nunca reutilizados; un icono 24x24 de trazo en public/assets/js/icons.js (P) y un matiz en HUE, o saldrá el icono de reloj de reserva.
- Al terminar todos los temas: npm run e2e (Playwright está en %TEMP%\pw\node_modules: cópialo con cp -r a ./node_modules y bórralo con rm -rf al acabar, porque el repo está en OneDrive), actualiza las cifras y la tabla por tema de README.md y README.es.md y ejecuta npm run media.
- Si el chat se queda sin contexto: haz commit de lo hecho, y deja en la última línea del informe qué tema y nivel faltan para que otro chat continúe.

REGLAS
- Commits solo locales. Autor 344108195+babylonace@users.noreply.github.com. Sin línea de coautor ni mención de IA en los commits. NO hagas push hasta que yo diga sí.
- Textos públicos con voz directa y sencilla, sin tópicos ni datos inventados.
- No toques .github/, firebase/ ni la configuración de cuentas.

AL FINAL
Dime: preguntas añadidas por tema y nivel, qué datos te dejan dudas de veracidad, qué solapa con temas existentes, y propón (sin escribirla todavía) la actualización del vault: nota proyecto-repaso, líneas a añadir y entrada para log.md.

TAREA ESPECÍFICA
Las categorías g="lang" (py, jv) y g="web" (spr, api, fe) ya existen: NO las crees de nuevo. Lee fe.json antes para no solapar con el tema Frontend & Web, y un tema de lenguaje existente (py.json) para copiar el nivel y el tono.
Temas, en este orden de prioridad:
1. js (lang), prefijo JS: "JavaScript & TypeScript". Closures, event loop, promesas y async/await, this, módulos, prototipos, igualdad y coerción, tipos de TypeScript, genéricos, narrowing, utilidades de tipos.
2. react (web), prefijo RE: "React & modern frontend" / "React y frontend moderno". Hooks, renderizado y reconciliación, estado, efectos y sus trampas, rendimiento, accesibilidad, nociones de Next.js.
3. node (web), prefijo NODE: "Node.js backend". Event loop, streams, Express o Fastify, autenticación, manejo de errores, testing.
4. cpp (lang), prefijo CPP: "C & C++". Punteros y memoria, RAII, punteros inteligentes, STL, comportamiento indefinido, semántica de movimiento.
5. dotnet (lang), prefijo DN: "C# & .NET". CLR, async/await, LINQ, inyección de dependencias, EF Core, ASP.NET Core.
6. go (lang), prefijo GO: "Go". Goroutines, canales, interfaces, errores, context.
```

## 5. repaso-cs-qa-mobile: Informática, calidad y móvil

```
Trabajo en Repaso, en la carpeta de este repo. Antes de nada lee docs/content-plan.md (árbol, "Quality bar" y "How to add a category and its topics") y docs/maintenance.md (sección "Adding content"). Mira también 2 o 3 preguntas de temas ya existentes parecidos para copiar el esquema de los campos (content/questions/*.json) y el estilo.
El alcance ya está confirmado aquí: empieza sin preguntas previas, salvo un bloqueo real.

CÓMO TRABAJAR
- Un tema cada vez, en el orden indicado. Por tema: (1) investiga qué se pregunta hoy en entrevistas (guías recientes de entrevistas y documentación oficial); (2) escribe unas 40 preguntas: ~6 de nivel 0, ~12 de nivel 1, ~14 de nivel 2, ~8 de nivel 3, y alrededor de una de cada diez como flashcard (t:"f"); (3) verifica cada dato con documentación oficial o la especificación; (4) guarda las fuentes en docs/sources/<k>.md (una línea por fuente, con URL y qué dato respalda: el agente mensual las usará para revisar contenido que envejece); (5) añade los términos nuevos a content/glossary.json; (6) traduce al español con npm run i18n -- todo / apply; (7) npm test; (8) commit local de ese tema.
- Calidad: cuatro opciones, una correcta y tres que un candidato medio preparado elegiría de verdad; nada de "todas las anteriores" ni opciones de broma; la explicación dice por qué la correcta lo es y por qué falla la opción más tentadora. Incluye preguntas de escenario ("una consulta se volvió lenta", "el pod se reinicia"), no solo definiciones. Cualquier dato ligado a una versión nombra la versión. Evita nombres de modelos, precios y cuotas que caducan rápido: pregunta por conceptos.
- Español: traducción real, mismos code spans, misma estructura de líneas, sin rayas largas. Términos que en español se dicen en inglés (deploy, commit, pull request) se quedan en inglés.
- Si la categoría es nueva: añádela a content/groups.json al llegar su primer tema (el validador rechaza categorías vacías). Cada tema nuevo: entrada en content/topics.json con k, g, name, name_es y p; ids nuevos PREFIJO-01, PREFIJO-02..., nunca reutilizados; un icono 24x24 de trazo en public/assets/js/icons.js (P) y un matiz en HUE, o saldrá el icono de reloj de reserva.
- Al terminar todos los temas: npm run e2e (Playwright está en %TEMP%\pw\node_modules: cópialo con cp -r a ./node_modules y bórralo con rm -rf al acabar, porque el repo está en OneDrive), actualiza las cifras y la tabla por tema de README.md y README.es.md y ejecuta npm run media.
- Si el chat se queda sin contexto: haz commit de lo hecho, y deja en la última línea del informe qué tema y nivel faltan para que otro chat continúe.

REGLAS
- Commits solo locales. Autor 344108195+babylonace@users.noreply.github.com. Sin línea de coautor ni mención de IA en los commits. NO hagas push hasta que yo diga sí.
- Textos públicos con voz directa y sencilla, sin tópicos ni datos inventados.
- No toques .github/, firebase/ ni la configuración de cuentas.

AL FINAL
Dime: preguntas añadidas por tema y nivel, qué datos te dejan dudas de veracidad, qué solapa con temas existentes, y propón (sin escribirla todavía) la actualización del vault: nota proyecto-repaso, líneas a añadir y entrada para log.md.

TAREA ESPECÍFICA
Las categorías g="cs" (algo, oop, sys) y g="qs" (test, sec) ya existen: NO las crees de nuevo. La categoría g="mobile" es NUEVA (name "Mobile", name_es "Móvil"). Lee sys.json y test.json antes para no solapar.
Temas, en este orden:
1. os (cs), prefijo OS: "Operating systems & concurrency" / "Sistemas operativos y concurrencia". Procesos e hilos, bloqueos, deadlocks, memoria virtual, planificación, E/S.
2. net (cs), prefijo NET: "Networking" / "Redes". TCP y UDP, DNS, HTTP/2 y 3, TLS, balanceo de carga, NAT, depuración de red.
3. qa (qs), prefijo QA: "QA automation & SDET" / "Automatización de QA y SDET". Selenium y Playwright, esperas, page objects, tests inestables (flaky), datos de prueba en CI, leer logs y DevTools, pruebas asistidas por IA.
4. android (mobile), prefijo AND: "Android & Kotlin". Ciclo de vida, corrutinas, Jetpack Compose, arquitectura, almacenamiento, permisos.
5. ios (mobile), prefijo IOS: "iOS & Swift". ARC, opcionales, SwiftUI, concurrencia, ciclo de vida.
```

## 6. repaso-embedded: Embebidos, IoT y robótica (nueva categoría)

```
Trabajo en Repaso, en la carpeta de este repo. Antes de nada lee docs/content-plan.md (árbol, "Quality bar" y "How to add a category and its topics") y docs/maintenance.md (sección "Adding content"). Mira también 2 o 3 preguntas de temas ya existentes parecidos para copiar el esquema de los campos (content/questions/*.json) y el estilo.
El alcance ya está confirmado aquí: empieza sin preguntas previas, salvo un bloqueo real.

CÓMO TRABAJAR
- Un tema cada vez, en el orden indicado. Por tema: (1) investiga qué se pregunta hoy en entrevistas (guías recientes de entrevistas y documentación oficial); (2) escribe unas 40 preguntas: ~6 de nivel 0, ~12 de nivel 1, ~14 de nivel 2, ~8 de nivel 3, y alrededor de una de cada diez como flashcard (t:"f"); (3) verifica cada dato con documentación oficial o la especificación; (4) guarda las fuentes en docs/sources/<k>.md (una línea por fuente, con URL y qué dato respalda: el agente mensual las usará para revisar contenido que envejece); (5) añade los términos nuevos a content/glossary.json; (6) traduce al español con npm run i18n -- todo / apply; (7) npm test; (8) commit local de ese tema.
- Calidad: cuatro opciones, una correcta y tres que un candidato medio preparado elegiría de verdad; nada de "todas las anteriores" ni opciones de broma; la explicación dice por qué la correcta lo es y por qué falla la opción más tentadora. Incluye preguntas de escenario ("una consulta se volvió lenta", "el pod se reinicia"), no solo definiciones. Cualquier dato ligado a una versión nombra la versión. Evita nombres de modelos, precios y cuotas que caducan rápido: pregunta por conceptos.
- Español: traducción real, mismos code spans, misma estructura de líneas, sin rayas largas. Términos que en español se dicen en inglés (deploy, commit, pull request) se quedan en inglés.
- Si la categoría es nueva: añádela a content/groups.json al llegar su primer tema (el validador rechaza categorías vacías). Cada tema nuevo: entrada en content/topics.json con k, g, name, name_es y p; ids nuevos PREFIJO-01, PREFIJO-02..., nunca reutilizados; un icono 24x24 de trazo en public/assets/js/icons.js (P) y un matiz en HUE, o saldrá el icono de reloj de reserva.
- Al terminar todos los temas: npm run e2e (Playwright está en %TEMP%\pw\node_modules: cópialo con cp -r a ./node_modules y bórralo con rm -rf al acabar, porque el repo está en OneDrive), actualiza las cifras y la tabla por tema de README.md y README.es.md y ejecuta npm run media.
- Si el chat se queda sin contexto: haz commit de lo hecho, y deja en la última línea del informe qué tema y nivel faltan para que otro chat continúe.

REGLAS
- Commits solo locales. Autor 344108195+babylonace@users.noreply.github.com. Sin línea de coautor ni mención de IA en los commits. NO hagas push hasta que yo diga sí.
- Textos públicos con voz directa y sencilla, sin tópicos ni datos inventados.
- No toques .github/, firebase/ ni la configuración de cuentas.

AL FINAL
Dime: preguntas añadidas por tema y nivel, qué datos te dejan dudas de veracidad, qué solapa con temas existentes, y propón (sin escribirla todavía) la actualización del vault: nota proyecto-repaso, líneas a añadir y entrada para log.md.

TAREA ESPECÍFICA
Categoría nueva: g="emb", name "Embedded, IoT & robotics", name_es "Embebidos, IoT y robótica". Es el área que mejor encaja con mi perfil (ingeniera mecatrónica): ponle especial cuidado técnico. Sin ejemplos de código pesados; los fragmentos de C deben compilar.
Temas, en este orden:
1. embc, prefijo EMB: "Embedded C & microcontrollers" / "C embebido y microcontroladores". volatile, interrupciones, memoria y alineación, trabajo con bits, temporizadores, DMA, bajo consumo, estructuras sin asignación dinámica (buffer circular, pool de bloques).
2. rtos, prefijo RTOS: "RTOS & concurrency" / "RTOS y concurrencia". Tareas y prioridades, inversión de prioridad, colas y semáforos, planificación, watchdogs.
3. proto, prefijo PRO: "Protocols & connectivity" / "Protocolos y conectividad". I2C, SPI, UART, CAN, MQTT, BLE, actualizaciones seguras (OTA).
4. ctrl, prefijo CTL: "Control, PLC & robotics" / "Control, PLC y robótica". PID, máquinas de estados, nociones de PLC (IEC 61131-3), cinemática, ROS, sensores y filtrado.
```

## 7. repaso-team: Equipo y carrera (se añade a la categoría que ya existe)

```
Trabajo en Repaso, en la carpeta de este repo. Antes de nada lee docs/content-plan.md (árbol, "Quality bar" y "How to add a category and its topics") y docs/maintenance.md (sección "Adding content"). Mira también 2 o 3 preguntas de temas ya existentes parecidos para copiar el esquema de los campos (content/questions/*.json) y el estilo.
El alcance ya está confirmado aquí: empieza sin preguntas previas, salvo un bloqueo real.

CÓMO TRABAJAR
- Un tema cada vez, en el orden indicado. Por tema: (1) investiga qué se pregunta hoy en entrevistas (guías recientes de entrevistas y documentación oficial); (2) escribe unas 40 preguntas: ~6 de nivel 0, ~12 de nivel 1, ~14 de nivel 2, ~8 de nivel 3, y alrededor de una de cada diez como flashcard (t:"f"); (3) verifica cada dato con documentación oficial o la especificación; (4) guarda las fuentes en docs/sources/<k>.md (una línea por fuente, con URL y qué dato respalda: el agente mensual las usará para revisar contenido que envejece); (5) añade los términos nuevos a content/glossary.json; (6) traduce al español con npm run i18n -- todo / apply; (7) npm test; (8) commit local de ese tema.
- Calidad: cuatro opciones, una correcta y tres que un candidato medio preparado elegiría de verdad; nada de "todas las anteriores" ni opciones de broma; la explicación dice por qué la correcta lo es y por qué falla la opción más tentadora. Incluye preguntas de escenario ("una consulta se volvió lenta", "el pod se reinicia"), no solo definiciones. Cualquier dato ligado a una versión nombra la versión. Evita nombres de modelos, precios y cuotas que caducan rápido: pregunta por conceptos.
- Español: traducción real, mismos code spans, misma estructura de líneas, sin rayas largas. Términos que en español se dicen en inglés (deploy, commit, pull request) se quedan en inglés.
- Si la categoría es nueva: añádela a content/groups.json al llegar su primer tema (el validador rechaza categorías vacías). Cada tema nuevo: entrada en content/topics.json con k, g, name, name_es y p; ids nuevos PREFIJO-01, PREFIJO-02..., nunca reutilizados; un icono 24x24 de trazo en public/assets/js/icons.js (P) y un matiz en HUE, o saldrá el icono de reloj de reserva.
- Al terminar todos los temas: npm run e2e (Playwright está en %TEMP%\pw\node_modules: cópialo con cp -r a ./node_modules y bórralo con rm -rf al acabar, porque el repo está en OneDrive), actualiza las cifras y la tabla por tema de README.md y README.es.md y ejecuta npm run media.
- Si el chat se queda sin contexto: haz commit de lo hecho, y deja en la última línea del informe qué tema y nivel faltan para que otro chat continúe.

REGLAS
- Commits solo locales. Autor 344108195+babylonace@users.noreply.github.com. Sin línea de coautor ni mención de IA en los commits. NO hagas push hasta que yo diga sí.
- Textos públicos con voz directa y sencilla, sin tópicos ni datos inventados.
- No toques .github/, firebase/ ni la configuración de cuentas.

AL FINAL
Dime: preguntas añadidas por tema y nivel, qué datos te dejan dudas de veracidad, qué solapa con temas existentes, y propón (sin escribirla todavía) la actualización del vault: nota proyecto-repaso, líneas a añadir y entrada para log.md.

TAREA ESPECÍFICA
La categoría g="team" ya existe (vcs, beh): NO la crees de nuevo. Lee beh.json y vcs.json antes.
Tema:
1. agile, prefijo AG: "Agile & delivery" / "Agile y entrega". Scrum y Kanban, estimación, revisión de código, gestión de incidentes, deuda técnica, comunicación con producto, definición de hecho, entrega continua.
Cuando termines, añade como segunda tarea la revisión global: recorre el sitio entero en inglés y español, comprueba que todas las categorías y temas se ven bien en móvil y escritorio, que README.md y README.es.md tienen las cifras finales, y propón el push.
```
