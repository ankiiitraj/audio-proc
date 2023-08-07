import os
from httpx import AsyncClient
import requests
from dotenv import load_dotenv

load_dotenv()


DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
DEEPGRAM_API = AsyncClient(base_url='https://api.deepgram.com/v1', headers={'Authorization': f"Token {DEEPGRAM_API_KEY}", 'Content-Type': "audio/mp3"})

def speakers_count(audio_file_path):
    speaker_set = set()
    audio = open(audio_file_path, 'rb')
    response = requests.post('https://api.deepgram.com/v1/listen?diarize=true', data=audio, headers={'Authorization': f"Token {DEEPGRAM_API_KEY}", 'Content-Type': "audio/mp3"})
    resp_json = response.json()
    statements = resp_json['results']['channels'][0]['alternatives']
    for statement in statements:
        words = statement['words']
        for word in words:
            speaker_set.add(word['speaker'])
    return len(speaker_set)
