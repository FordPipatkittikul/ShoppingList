from enum import Enum
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from shoppinglist import shopping_list_router

app = FastAPI()

@app.get("/")
async def homepage():
    return FileResponse("./frontend/index.html")

app.include_router(shopping_list_router, tags=["ShoppingList"])

app.mount("/", StaticFiles(directory="frontend"), name="static")