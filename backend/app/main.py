from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import app.models.usuario as usuario
from app.core.database import engine
from app.controllers.auth_controller import router as auth_controller
from app.controllers.aposta_controller import router as aposta_controller
from app.controllers.animais_controller import router as animais_controller


usuario.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {"msg": "API funcionando"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_controller)
app.include_router(aposta_controller)
app.include_router(animais_controller)


# uvicorn main:app --reload 
# .\venv\Scripts\Activate  