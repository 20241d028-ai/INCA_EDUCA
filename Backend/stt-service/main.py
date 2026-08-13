from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from faster_whisper import WhisperModel
from pydantic import BaseModel
import tempfile
import subprocess
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Voz a texto (STT) ---
modelo_whisper = WhisperModel("small", device="cpu", compute_type="int8")


@app.post("/transcribir")
async def transcribir(audio: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        contenido = await audio.read()
        tmp.write(contenido)
        ruta_temporal = tmp.name

    try:
        segmentos, _ = modelo_whisper.transcribe(ruta_temporal, language="es")
        texto = " ".join(segmento.text.strip() for segmento in segmentos)
        return {"texto": texto}
    finally:
        os.remove(ruta_temporal)


# --- Texto a voz (TTS) ---
RUTA_MODELO_TTS = "voces/es_MX-ald-medium.onnx"


class TextoEntrada(BaseModel):
    texto: str


@app.post("/generar-audio")
async def generar_audio(payload: TextoEntrada):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        ruta_salida = tmp.name

    proceso = subprocess.run(
        ["piper", "--model", RUTA_MODELO_TTS, "--output_file", ruta_salida],
        input=payload.texto.encode("utf-8"),
        capture_output=True,
    )

    if proceso.returncode != 0:
        os.remove(ruta_salida)
        return {"error": proceso.stderr.decode("utf-8")}

    return FileResponse(ruta_salida, media_type="audio/wav", filename="respuesta.wav")


@app.get("/")
def salud():
    return {"estado": "Servicio de voz INCA EDUCA activo (STT + TTS)"}