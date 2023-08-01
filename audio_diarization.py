import os
from httpx import AsyncClient
import requests

import asyncio
# from pyannote.audio import Pipeline
from dotenv import load_dotenv


load_dotenv()
HUGGING_FACE_API_KEY = os.getenv("DYTE_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

DEEPGRAM_API = AsyncClient(base_url='https://api.deepgram.com/v1', headers={'Authorization': f"Token {DEEPGRAM_API_KEY}", 'Content-Type': "audio/mp3"})

def speakers_count(audio_file_path):
    # pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization", use_auth_token="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")
    # diarization = pipeline(audio_file_path)
    speaker_set = set()
    # for turn, _, speaker in diarization.itertracks(yield_label=True):
    #     speaker_set.add(speaker)
    # return len(speaker_set)

    audio = open(audio_file_path, 'rb')
    response = requests.post('https://api.deepgram.com/v1/listen?diarize=true', data=audio, headers={'Authorization': f"Token {DEEPGRAM_API_KEY}", 'Content-Type': "audio/mp3"})
    resp_json = response.json()
    statements = resp_json['results']['channels'][0]['alternatives']
    for statement in statements:
        words = statement['words']
        for word in words:
            speaker_set.add(word['speaker'])
    return len(speaker_set)
