# Data Splitting Strategies for LLM Inference

| **Type of Splitting**      | **How it Works**                                                                 | **Pros**                                                    | **Cons**                                                   | **Best For**                                       |
|-----------------------------|---------------------------------------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------|---------------------------------------------------|
| Fixed-size chunks           | Split input into equal-size blocks (paragraphs, lines, or token-based).        | Simple, easy to implement, easy to distribute.            | May break context; output coherence may suffer.          | Embeddings, batch classification tasks          |
| Token-based chunks          | Split strictly by token count to fit model context limits.                     | Ensures each chunk fits in model context.                 | Needs tokenization; may break semantic units.            | LLMs with strict context limits                 |
| Semantic / Content-based    | Split according to paragraphs, sections, or topics.                             | Preserves meaning and coherence; better quality output.   | Uneven chunk sizes → load imbalance; more preprocessing. | Summarization, document QA                       |

