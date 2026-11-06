# Sources: LLMs, RAG & agents (`llm`)

One line per source: link, then the facts it backs. The monthly report checks that these links still answer. All checked in November 2026. The topic is about concepts, so no model names, prices or quotas are used.

- [Lewis et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401): what RAG is and why it adds retrieved text to the prompt instead of changing the model (LLM-12, LLM-13, LLM-18).
- [Liu et al., Lost in the Middle](https://arxiv.org/abs/2307.03172): models use information at the beginning and the end of a long input better than in the middle (LLM-23).
- [Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685): position, verbosity and self-enhancement biases of LLM judges, and agreement with human ratings (LLM-28, LLM-34, LLM-40).
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) and [LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/): direct and indirect prompt injection, least privilege, human approval of sensitive actions (LLM-14, LLM-24, LLM-32, LLM-33, LLM-35).
- [OpenAI: embeddings guide](https://platform.openai.com/docs/guides/embeddings): embeddings as vectors, cosine similarity for comparison, vectors normalized to length 1 (LLM-06, LLM-10, LLM-38).
- [OpenAI: conversation state](https://platform.openai.com/docs/guides/conversation-state): each request is independent, so the app resends the earlier messages (LLM-03, LLM-15).
- [OpenAI: function calling](https://platform.openai.com/docs/guides/function-calling) and [Anthropic: tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use): the model returns a call request, the application runs it and returns the result (LLM-17, LLM-26, LLM-35).
- [OpenAI: structured outputs](https://platform.openai.com/docs/guides/structured-outputs): schema-constrained JSON, and why the result still needs validation (LLM-25).
- [OpenAI: prompt caching](https://platform.openai.com/docs/guides/prompt-caching) and [Anthropic: prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching): a repeated prompt prefix is cheaper and faster (LLM-15, LLM-30, LLM-31).
- [OpenAI: latency optimization](https://platform.openai.com/docs/guides/latency-optimization) and [streaming responses](https://platform.openai.com/docs/guides/streaming-responses): streaming, shorter prompts, smaller models (LLM-30, LLM-37).
- [OpenAI: prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering) and [Anthropic: prompt engineering overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview): clear instructions, examples (few-shot), system messages, temperature (LLM-05, LLM-07, LLM-08, LLM-09, LLM-16).
- [OpenAI: evals guide](https://platform.openai.com/docs/guides/evals) and [Anthropic: develop tests](https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests): eval sets, scoring methods, comparing versions (LLM-21, LLM-27, LLM-34, LLM-36, LLM-40).
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents): the agent loop, stop conditions, tool design, human checkpoints (LLM-26, LLM-32, LLM-35).
- [Sentence Transformers: retrieve and re-rank](https://www.sbert.net/examples/applications/retrieve_rerank/README.html): bi-encoder retrieval followed by a cross-encoder re-ranker (LLM-22).
- [Weaviate: hybrid search](https://weaviate.io/developers/weaviate/search/hybrid): combining BM25 keyword search with vector search by fusing the two result sets (LLM-20).

Not backed by one page, so they rest on general engineering practice: chunking trade-offs (LLM-11, LLM-19), per-user permission filtering at retrieval time (LLM-33), model routing by difficulty (LLM-37), and the contents of the design and eval-set flashcards (LLM-39, LLM-40).
