import os
import json
from dotenv import load_dotenv
from groq import Groq
from rag import retrieve_relevant_knowledge, retrieve_from_openalex

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SCHEMA_DESCRIPTION = """
Return ONLY a valid JSON object with exactly these keys:
{
  "title": "string",
  "authors": ["string", "string"],
  "year": "string or empty string if unknown",
  "summary": "string",
  "problem": "string",
  "methodology": ["string", "string"],
  "dataset": "string",
  "results": [
    {"metric": "string (e.g. BLEU, Accuracy)", "value": "string (e.g. 41.8, 92.4%)", "context": "string, brief note on what this measures"}
  ],
  "limitations": ["string", "string"],
  "prerequisites": ["string", "string"],
  "questions": ["string", "string"]
}
For "results": extract actual named metrics and their reported values from the paper if present.
If a result is not a clean numeric metric, still include it with "metric" as a short label and "value" as the descriptive text.
If authors or year are not identifiable from the text, return an empty array/string rather than guessing.
Do not include any text outside the JSON object.
"""
def extract_search_keywords(paper_text: str) -> str:
    """Ask the LLM to pull out a short, clean search phrase from the paper's
    abstract/intro — much better for OpenAlex search than raw sliced text."""
    prompt = f"""Read this excerpt from a research paper and return ONLY a short search query (5-8 words) capturing its core topic. No punctuation, no explanation, just the search phrase.

TEXT:
{paper_text[:1200]}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=30,
    )
    return response.choices[0].message.content.strip()

def analyze_paper(paper_text: str) -> dict:
    query = paper_text[:500]
    local_knowledge = retrieve_relevant_knowledge(query, top_k=2)

    # OpenAlex generalizes retrieval to any paper topic by searching real
    # academic literature, unlike our narrow local knowledge base.
    openalex_query = extract_search_keywords(paper_text)
    external_knowledge = retrieve_from_openalex(openalex_query, top_k=2)
    print(f"DEBUG — local_knowledge count: {len(local_knowledge)}")
    print(f"DEBUG — external_knowledge count: {len(external_knowledge)}")
    print(f"DEBUG — OpenAlex query: {openalex_query!r}")
    print(f"DEBUG — OpenAlex results: {external_knowledge}")

    retrieved_knowledge = local_knowledge + external_knowledge
    knowledge_context = "\n\n".join(retrieved_knowledge)

    prompt = f"""You are analyzing an academic research paper for a student.

{SCHEMA_DESCRIPTION}

BACKGROUND KNOWLEDGE (use this to make explanations clearer for a student):
{knowledge_context}

PAPER TEXT:
{paper_text[:15000]}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    raw_output = response.choices[0].message.content
    result = json.loads(raw_output)

    result["retrieved_knowledge"] = retrieved_knowledge
    return result


if __name__ == "__main__":
    from pdf_parser import extract_text_from_pdf

    text = extract_text_from_pdf("Attention is all you need.pdf")
    result = analyze_paper(text)

    print(json.dumps(result, indent=2))