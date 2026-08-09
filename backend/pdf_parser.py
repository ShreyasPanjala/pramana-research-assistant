import fitz  # this is PyMuPDF's import name — confusing but that's just how the package works

def extract_text_from_pdf(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)  # opens the PDF
    full_text = ""

    for page_num in range(len(doc)):
        page = doc[page_num]
        full_text += page.get_text()  # extracts plain text from that page
        full_text += "\n"

    doc.close()
    return full_text


if __name__ == "__main__":
    # quick manual test — run this file directly to check extraction works
    sample_path = "Attention is all you need.pdf"
    text = extract_text_from_pdf(sample_path)
    print(f"Extracted {len(text)} characters")
    print("---- First 500 chars ----")
    print(text[:500])
