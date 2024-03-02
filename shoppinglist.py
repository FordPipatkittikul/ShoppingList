from typing import Annotated
from fastapi import APIRouter, HTTPException, Path, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from model import ShoppingList, ShoppingListRequest

shopping_list_router = APIRouter()

shopping_list: list[ShoppingList] = []


@shopping_list_router.post("/shopping-list", status_code=status.HTTP_201_CREATED)
async def add_item_in_shopping_list(shopping: ShoppingListRequest) -> ShoppingList:
    if(len(shopping_list) == 0):
        id = 1
    else:
        id = max(shopping_list, key=lambda x: x.id).id + 1
    new_shopping_list = ShoppingList(id=id, name=shopping.name)
    for item in shopping_list:
        if item.name == new_shopping_list.name:
            return {"Error":" you can not have duplicate item in the shoppinglist"}
    shopping_list.append(new_shopping_list)
    json_obj = new_shopping_list.model_dump()
    return JSONResponse(json_obj, status_code=status.HTTP_201_CREATED)
    

# jsonable_encoder : Convert any object to something that can be encoded in JSON
@shopping_list_router.get("/shopping-list")
async def get_all_items_shopping_list() -> dict:
    json = jsonable_encoder(shopping_list)
    return JSONResponse(json)

@shopping_list_router.get("/shopping-list/{id}")
async def get_item_in_shopping_list_by_id(
    id: Annotated[int, Path(title="type ID that greater than 0", ge=0, le=100)]
) -> dict:
    for item in shopping_list:
        if item.id == id:
            return {"shoppinglist" : item}
    
    return {"Error":f"Item with this ID:{id} does not exist"}

@shopping_list_router.put("/shopping-list/{name}")
async def update_item_in_shopping_list_by_name(name: str, shopping: ShoppingListRequest) -> dict:
    for item in shopping_list:
        if item.name == name:
            item.name = shopping.name
            return {"Message": f"update Item successfully"}
    
    return {"Error":f"we do not have {name}"}

@shopping_list_router.delete("/shopping-list/{name}")
async def delete_item_in_shopping_list_by_name(name:str) -> dict:
    for i in range(len(shopping_list)):
        item = shopping_list[i]
        if item.name == name:
            shopping_list.pop(i)
            return {"msg": f"delete {name} successfully"}
    
    return {"Error":f"we do not have {name}"}

@shopping_list_router.delete("/shopping-list")
async def delete_all_items_in_shopping_list() -> dict:
    for i in range(len(shopping_list)):
        item = shopping_list[i]
        if item :
            shopping_list.clear()
            return {"msg": "successfully delete all items"}
    return {"msg" : "There is no item left to delete anymore"}
            