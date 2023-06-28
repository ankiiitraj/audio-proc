import base64
from fastapi import FastAPI, UploadFile, HTTPException
from httpx import AsyncClient
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
IMGUR_CLIENT_ID = os.getenv("IMGUR_CLIENT_ID")

async def upload_image(img_data):
    headers = {
        "Authorization": f"Client-ID {IMGUR_CLIENT_ID}"
    }
    data = {
        "image": img_data
    }
    
    async with AsyncClient() as client:
        response = await client.post("https://api.imgur.com/3/image", headers=headers, data=data)
        
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Could not upload image.")

    print(response.json())
    return response.json()["data"]["link"]