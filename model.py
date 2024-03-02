from pydantic import BaseModel
from typing import Optional

class ShoppingList(BaseModel):
    id: int
    name: str

class ShoppingListRequest(BaseModel):
    name: str


