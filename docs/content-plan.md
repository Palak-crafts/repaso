# Content plan: categories and topics

Repaso has two levels of structure. A **category** (`content/groups.json`) holds **topics** (`content/topics.json`, field `g`). The app calls categories "Categories" and topics "topics". Levels, spaced repetition, progress and unlocks all work per topic, so a topic is the unit of content: 4 levels (0 basics to 3 advanced), about 40 questions.

Today: 7 categories, 14 topics, 777 questions. The plan below grows it to 11 categories and about 39 topics. Each category is one chat, so no single conversation has to hold 1,000+ questions and their translations.

## Why these areas

Chosen from what developers actually use and what interview loops actually ask, not from a wish list.

- **What is used.** The [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/technology/): JavaScript, HTML/CSS, SQL and Python lead the languages; PostgreSQL leads the databases; Docker, npm and AWS lead the tools. Reported numbers differ between secondary write-ups, so only the ranking is used here, not the percentages.
- **What is asked.** Current interview guides for [SRE](https://www.kore1.com/sre-interview-questions/) (SLOs, error budgets, incidents, observability), [QA/SDET](https://www.kore1.com/qa-engineer-interview-questions/) (waits, page objects, test data in CI, reading logs), [embedded](https://www.kore1.com/embedded-software-engineer-interview-questions/) (memory-constrained C, RTOS scheduling, interrupts, DMA, update paths) and [general software engineering](https://www.kore1.com/software-engineer-interview-questions/) (data structures, system design, behavioural, debugging, AI-tool fluency). Senior guidance adds AI system design: retrieval, evals, latency, cost, guardrails.
- **What was thin.** The searches gave no good 2026 data for data-engineering and mobile interviews, so those topic lists come from the roadmap.sh role maps and general knowledge. The chat that writes them must verify each fact against official documentation anyway.
- **Who it's for.** Adriana's profile (mechatronics) makes embedded and robotics a real differentiator: few free bilingual sites cover it.

## The tree

`id prefix` is the question id prefix and the topic's `p`. Keys are lowercase, up to 32 characters, never reused.

| Category (`g`) | Topic (`k`, prefix) | Status | Covers (subcategory ideas) |
|---|---|---|---|
| **Programming languages** `lang` | Python `py` | done | |
| | Java Core `jv` | done | |
| | JavaScript & TypeScript `js` (JS) | planned P1 | closures, event loop, promises, this, modules, TS types, generics, narrowing |
| | C & C++ `cpp` (CPP) | planned P2 | pointers, memory, RAII, smart pointers, STL, undefined behaviour, move semantics |
| | C# & .NET `dotnet` (DN) | planned P2 | CLR, async/await, LINQ, DI, EF Core, ASP.NET Core |
| | Go `go` (GO) | planned P3 | goroutines, channels, interfaces, errors, context |
| **Backend & web** `web` | Spring, JPA & Java Web `spr` | done | |
| | Backend & APIs `api` | done | |
| | Frontend & Web `fe` | done | |
| | React & modern frontend `react` (RE) | planned P1 | hooks, rendering, state, effects, performance, Next.js basics |
| | Node.js backend `node` (NODE) | planned P2 | event loop, streams, Express/Fastify, auth, testing |
| **Data & databases** `data` | Databases & SQL `db` | done | |
| | NoSQL & caching `nosql` (NOSQL) | planned P1 | document, key-value, wide-column, graph, Redis, consistency, CAP |
| | Data engineering `de` (DE) | planned P1 | pipelines, ETL/ELT, warehouses, Spark, Kafka, orchestration, data quality, modelling |
| | Data analysis & BI `da` (DA) | planned P2 | statistics, A/B tests, pandas, SQL for analysis, dashboards, metrics |
| **AI & machine learning** `ai` | ML fundamentals `ml` (ML) | planned P1 | bias/variance, metrics, overfitting, features, trees, regularisation, evaluation |
| | LLMs, RAG & agents `llm` (LLM) | planned P1 | tokens, prompting, embeddings, RAG, tool use, evals, guardrails, cost and latency |
| | MLOps & serving `mlops` (MLO) | planned P3 | pipelines, drift, monitoring, feature stores, deployment |
| **Cloud & DevOps** `cloud` | Cloud & DevOps `ops` | done | (95 questions, already broad: Docker, Kubernetes, CI/CD, cloud basics) |
| | SRE & observability `sre` (SRE) | planned P1 | SLI/SLO, error budgets, incidents, logs/metrics/traces, capacity |
| | Infrastructure as code `iac` (IAC) | planned P2 | Terraform state, drift, modules, Ansible, GitOps |
| | Cloud providers `cprov` (CLD) | planned P2 | AWS first, with Azure and GCP equivalents: IAM, networking, storage, serverless, cost |
| **Computer science & design** `cs` | Algorithms & DS `algo` | done | |
| | Design & Practices `oop` | done | |
| | System Design `sys` | done | |
| | Operating systems & concurrency `os` (OS) | planned P2 | processes, threads, locks, deadlocks, memory, scheduling, I/O |
| | Networking `net` (NET) | planned P2 | TCP/UDP, DNS, HTTP/2/3, TLS, load balancing, NAT |
| **Quality & security** `qs` | Testing `test` | done | |
| | Security `sec` | done | |
| | QA automation & SDET `qa` (QA) | planned P2 | Selenium/Playwright, waits, page objects, flaky tests, test data, CI |
| **Mobile** `mobile` | Android & Kotlin `android` (AND) | planned P2 | lifecycle, coroutines, Compose, architecture, storage |
| | iOS & Swift `ios` (IOS) | planned P3 | ARC, optionals, SwiftUI, concurrency, lifecycle |
| **Embedded, IoT & robotics** `emb` | Embedded C & microcontrollers `embc` (EMB) | planned P2 | volatile, interrupts, memory, bit work, timers, DMA, low power |
| | RTOS & concurrency `rtos` (RTOS) | planned P3 | tasks, priorities, inversion, queues, semaphores, watchdogs |
| | Protocols & connectivity `proto` (PRO) | planned P3 | I2C, SPI, UART, CAN, MQTT, BLE, secure updates |
| | Control, PLC & robotics `ctrl` (CTL) | planned P3 | PID, state machines, PLC basics, kinematics, ROS, sensors |
| **Teamwork & career** `team` | Git & VCS `vcs` | done | |
| | Behavioural `beh` | done | |
| | Agile & delivery `agile` (AG) | planned P3 | Scrum, Kanban, estimation, code review, incidents, tech debt |

Priority: P1 first (largest audience, most asked), then P2, then P3. One chat per category, in this order of value: **AI**, **Data**, **Cloud**, **Programming languages and Backend & web** (JS, React first), **Computer science, Quality, Mobile**, **Embedded**, **Teamwork**.

A topic with an existing sibling is not duplicated. `ops` is 95 questions and already covers Docker and Kubernetes, so the cloud chat adds SRE, IaC and providers instead of splitting `ops`.

## Quality bar for every topic

- About 40 questions: roughly 6 on level 0, 12 on level 1, 14 on level 2, 8 on level 3. About one in ten is a flashcard (`t: "f"`) for open, whiteboard-style answers.
- Multiple choice: four options, one right, three that a half-prepared candidate would really pick. No "all of the above", no joke options. The explanation says why the right one is right and why the likeliest wrong one is not.
- Every fact is checked against official documentation or a spec, and the source is listed in the pull request description. Anything version-bound names the version.
- Include scenario questions ("a query got slow", "the pod restarts"), not only definitions: interviews have moved from recall to scenarios.
- Add each new term to `content/glossary.json` and list its key in the question's `g`.
- Plain, direct English. Spanish is a real translation: code spans identical, same line structure, no em dashes. Terms people really say in Spanish stay in English (deploy, commit, pull request).

## How to add a category and its topics

Read [maintenance.md](maintenance.md#adding-content) first. Then:

1. `content/groups.json`: add the category (`k`, `name`, `name_es`) when its first topic arrives. The validator rejects an empty category.
2. `content/topics.json`: add `{ "k", "g", "name", "name_es", "p" }` per topic.
3. `content/questions/<k>.json` with new ids `<PREFIX>-01`... Every level 0 to 3 needs at least one question.
4. `public/assets/js/icons.js`: add a 24x24 stroke icon to `P` and a hue to `HUE` for each topic, or it shows the clock fallback.
5. English glossary terms, then Spanish: `npm run i18n -- todo`, translate, `npm run i18n -- apply <patch.json>`.
6. `npm test` and `npm run e2e`. Update the numbers in README.md and README.es.md, and run `npm run media`.
7. Commit locally. Do not push until the maintainer says yes.

## Prompts, one per chat

The seven ready-to-paste prompts, with the exact topics, keys and prefixes of each chat, are in [content-prompts.md](content-prompts.md). Suggested chat names: `repaso-ai`, `repaso-data`, `repaso-cloud`, `repaso-lang-web`, `repaso-cs-qa-mobile`, `repaso-embedded`, `repaso-team`.

## Later: a third level

If a topic grows past about 80 questions, add an optional `s` (subtopic) tag to questions and a filter chip row on the study page. It needs no change to progress or levels, so it is deliberately left until a topic needs it. `ops` (95) is the first candidate.
