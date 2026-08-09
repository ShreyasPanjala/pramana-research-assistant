import os
import requests
import chromadb

KNOWLEDGE_DIR = "knowledge"

# This creates a local, on-disk vector database in a folder called chroma_db
client = chromadb.PersistentClient(path="chroma_db")

# A "collection" is like a table — it stores our chunks + their embeddings
collection = client.get_or_create_collection(name="paper_knowledge")


def build_knowledge_base():
    """Read each knowledge file, embed it, and store it in the vector DB.
    Run this once (or whenever knowledge/ files change)."""
    for filename in os.listdir(KNOWLEDGE_DIR):
        if not filename.endswith(".txt"):
            continue

        filepath = os.path.join(KNOWLEDGE_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # id = filename without extension, e.g. "attention"
        doc_id = filename.replace(".txt", "")

        # add() automatically embeds `documents` using Chroma's default embedder
        collection.add(
            ids=[doc_id],
            documents=[content],
        )
        print(f"Added: {doc_id}")


def retrieve_relevant_knowledge(query: str, top_k: int = 2, max_distance: float = 1.1) -> list[str]:
    """Given a query (e.g. a paper's abstract or key terms),
    return semantically similar knowledge chunks — but only if they're
    actually close enough to be relevant. Prevents always returning
    something even when nothing in the local knowledge base fits."""
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        include=["documents", "distances"],
    )
    documents = results["documents"][0]
    distances = results["distances"][0]

    relevant = [doc for doc, dist in zip(documents, distances) if dist < max_distance]
    return relevant


def _reconstruct_abstract(inverted_index):
    """OpenAlex stores abstracts as {word: [positions]}. Rebuild plain text from it."""
    if not inverted_index:
        return ""
    position_map = {}
    for word, positions in inverted_index.items():
        for pos in positions:
            position_map[pos] = word
    ordered_words = [position_map[i] for i in sorted(position_map.keys())]
    return " ".join(ordered_words)


def retrieve_from_openalex(query: str, top_k: int = 2) -> list[str]:
    results = []
    try:
        response = requests.get(
            "https://api.openalex.org/works",
            params={"search": query, "per_page": top_k},
            timeout=5,
        )
        print(f"DEBUG — OpenAlex status code: {response.status_code}")
        response.raise_for_status()
        data = response.json()
        print(f"DEBUG — OpenAlex raw result count: {len(data.get('results', []))}")

        for work in data.get("results", []):
            title = work.get("title", "Untitled")
            abstract_index = work.get("abstract_inverted_index")
            abstract = _reconstruct_abstract(abstract_index) if abstract_index else ""

            if abstract:
                snippet = abstract[:500]
                results.append(f"{title}: {snippet}")
            else:
                results.append(title)

    except requests.RequestException as e:
        print(f"DEBUG — OpenAlex request failed: {e}")

    return results


if __name__ == "__main__":
    build_knowledge_base()

    test_query = "multi-head self-attention mechanism in transformers"
    matches = retrieve_relevant_knowledge(test_query)

    print("\n--- Retrieved local knowledge ---")
    for m in matches:
        print(m[:150], "...\n")

    openalex_matches = retrieve_from_openalex(test_query)
    print("--- Retrieved OpenAlex knowledge ---")
    for m in openalex_matches:
        print(m[:150], "...\n")