from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from Backend.storage import get_transactions, get_company_ids

app = FastAPI()

# Allow browser JS to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend files
app.mount("/static", StaticFiles(directory="Frontend"), name="static")


@app.get("/")
def serve_frontend():
    return FileResponse("Frontend/App.html")


@app.get("/companies")
def list_companies():
    return get_company_ids()


@app.get("/companies/{company_id}/transactions")
def list_transactions(company_id: str):
    return get_transactions(company_id)

#pip install fastapi uvicorn
#python -m uvicorn Backend.api:app --reload

#To run http://127.0.0.1:8000