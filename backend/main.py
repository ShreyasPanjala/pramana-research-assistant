from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from pdf_parser import extract_text_from_pdf
from llm import analyze_paper
from database import init_db, save_analysis, list_history, get_history_item, delete_history_item

app = FastAPI()

init_db()

# Allows your React dev server (different port) to call this API.
# Without this, the browser blocks the request as cross-origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # fine for local dev, tighten later if deployed
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        text = extract_text_from_pdf(temp_path)
        result = analyze_paper(text)
        save_analysis(file.filename, result)
        return result
    finally:
        os.remove(temp_path)  # clean up regardless of success/failure


@app.get("/history")
async def get_history():
    return list_history()


@app.get("/history/{item_id}")
async def get_history_detail(item_id: int):
    item = get_history_item(item_id)
    if item is None:
        return {"error": "Not found"}
    return item


@app.delete("/history/{item_id}")
async def remove_history_item(item_id: int):
    deleted = delete_history_item(item_id)
    return {"deleted": deleted}