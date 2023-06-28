import os

from pyannote.audio import Pipeline
from dotenv import load_dotenv


load_dotenv()
HUGGING_FACE_API_KEY = os.getenv("DYTE_API_KEY")

def speakers_count(audio_file_path):
    pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization", use_auth_token="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")
    diarization = pipeline(audio_file_path)
    speaker_set = set()
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        speaker_set.add(speaker)
    return len(speaker_set)