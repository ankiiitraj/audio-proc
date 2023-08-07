---
title: Building a Live Proctoring System using Dyte | Part-3
date: 2023-05-22
Time to read: 10 mins
tags: engineering, machine-learning, dyte, proctoring
---

# Building a Live Proctoring System using Dyte (Part - 3)

## TL;DR

By the end of this tutorial, we will have built a "Live Proctoring System" using Dyte APIs that allows the admin to monitor whether there are multiple voices from any candidate 👀🧑‍💻.

## Introduction

To prevent students from engaging in dishonest behavior during exams, proctoring is a commonly used monitoring method. 

However, when it comes to online exams, it's not feasible to have a proctor for every student. This is where live automatic proctoring comes in handy. 

By utilizing a webcam and microphone, this method monitors students during online exams. It employs computer vision and machine learning to identify any attempts at cheating.

✨ In this tutorial, we will build a live proctoring system using [Dyte](https://dyte.io/) APIs that allows an admin to monitor if there is presence of multiple voices in any candidate's background during the whole duration in real-time.

## High Level Design of the application

Our aim is to notify the proctor if we hear multiple voices from the candidate's background.

The proctor would be getting the candidate details along with a link to candidate's voice recording sample as a proof right in his meeting sidebar 🔊✨.

---------- change the image ------------
![User Journey](https://i.imgur.com/tG1UhF5.png)

- In this project, we will be using React with [Dyte UI kit](https://dyte.io/blog/custom-ui-kit-sdk/) and [Dyte React Web Core](https://www.npmjs.com/package/@dytesdk/react-web-core) packages for the frontend.
- For the backend, we will be using [FastApi](https://fastapi.tiangolo.com/lo/) (Python 3).
- We will be also using Database as a service by [ElephantSQL](https://www.elephantsql.com/) (PostgreSQL).
- We will be using Audio Diarization APIs to get speaker details from a sample audio clip.
------- change this as well -----------
![Architecture Diagram](https://i.imgur.com/fo5w7m3.png)

## Folder Structure

At the completion of the tutorial, the folder structure would look like this 👇

```
dyte-proctoring/
├── frontend
│   ├── README.md
│   ├── package.json
│   ├── public
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── Heading.jsx
│   │   ├── ImageInput.jsx
│   │   ├── Meet.jsx
│   │   ├── Proctor.jsx
│   │   ├── index.css
│   │   ├── index.jsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── setupTests.ts
│   │   ├── stage.jsx
│   │   └── utils.js
│   ├── tsconfig.json
├── venv
├── app.py
├── audio_diarization.py
└── requirements.txt
```

## Step 0: Configurations and Setup

🧑‍💻 Before we start building our proctoring system, we would need to set up a Dyte account.

We can create a free account by clicking on "Start Building" on [Dyte.io](https://dyte.io/) and signing up using Google or GitHub 🎉.

Once we have signed up, we can access our [Dyte API keys](https://dev.dyte.io/apikeys) from the "API Keys" tab in the left sidebar. We will keep these keys secure as we will be using later 🔑🤫.

![Creating a Dyte Account](https://i.imgur.com/RcAGmyG.gif)

Now, for our proctoring system, we will be using [React](https://react.dev/) for the frontend and [FastAPI](https://fastapi.tiangolo.com/lo/) for building the Backend and APIs.

We will begin by creating a new directory for out project, called `dyte-proctoring` and navigating into it using the following commands:

```bash
mkdir dyte-proctoring
cd dyte-proctoring
```

---

**NOTE**
----- change this as well --------
- We will also require an account of Imgur. Create an account on Imgur and create an API key. Here is a [step-by-step guide](https://apidocs.imgur.com/)
- We will also require an account on ElephantSQL, here is a [step-by-step guide](https://www.elephantsql.com/docs/index.html) to create a db on ElephantSQL.
- We will also require an account on Deepgram.com, here is a [step-by-step guide](https://developers.deepgram.com/docs).
---

Now back to the tutorial.

## Step 1: Setting up the Frontend

Now, Let's get started with setting up our frontend project usign React and Dyte! ✨

We will create a boilerplate React app using `create-react-app`. We can do this by running the following command:

```bash
yarn create react-app frontend
```

This will initialize a new React app in the `frontend` directory. 📁

Then, we will go ahead and install the `dyte react-web-core`, `dyte react-ui-kit` and `react-router` packages in this project this project using the following command 👇

```bash
yarn add @dytesdk/react-web-core @dytesdk/react-ui-kit react-router react-router-dom
```

![Setting up Frontend](https://i.imgur.com/diDIydh.gif)

## Step 3: Setting up the backend

Let's get started with setting up our FastAPI backend now 🙌

Now, we will go back to the root directory of our project and initiate our project here itself, for the ease of hosting:

```bash
cd ..
```

First of all we will go ahead and create our `requirements.txt` file in the root directory itself with the following content 👇

`requirements.txt`

```txt
cmake
fastapi
uvicorn
face_recognition
numpy
python-multipart
psycopg2-binary
httpx
python-dotenv
pydantic
requests
```

After this we will go ahead and create our virtual environment with `venv` and install the dependencies

```bash
python -m venv venv
source venv/bin/activate # for linux/mac
venv\Scripts\activate.bat # for windows
pip install -r requirements.txt
```

![Installing Dependencies](https://i.imgur.com/7a4o6zt.gif)

We will also create an environment variable file `.env`, for storing our credentials.

`.env`

```txt
DYTE_ORG_ID=<ID>
DYTE_API_KEY=<KEY>
IMGUR_CLIENT_ID=<ID>
DB_USER=<ID>
DB_PASSWORD=<PASSWORD>
DB_HOST=<HOST>
DEEPGRAM_API_KEY=<API_KEY>
```

## Step 4: Setting up Audio Upload

```python

```

## Step 5: Setting up our backend application

Now, we will create a new file named `app.py` and add our 🐘 [ElephantSQL](https://www.elephantsql.com/) PostgreSQL database connection and code for our APIs including `face detection logic`.

---

In this file we would need to create the following routes:

`GET /` - Root route

`POST /is_admin/` - Check if the user is an admin

`POST /multiple_voices_list/` - This route retrieves a list of participants who are detected suspicious

`POST /multiple_voices/` - Detect if there are multiple voices in the audio stream

`POST /meetings` - Create a new meeting

`POST /meetings/{meetingId}/participants` - This route is responsible for adding a participant to a specific meeting identified by `meetingId`

---

So let's get started 👇

`app.py`

```python
import base64
import io
import logging
import random
import requests

import uvicorn
from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from utils import upload_audio

import os
import base64
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from httpx import AsyncClient
import httpx
import uuid

from audio_diarization import speakers_count

load_dotenv()

DYTE_API_KEY = os.getenv("DYTE_API_KEY")
DYTE_ORG_ID = os.getenv("DYTE_ORG_ID")

API_HASH = base64.b64encode(f"{DYTE_ORG_ID}:{DYTE_API_KEY}".encode('utf-8')).decode('utf-8')

timeout = httpx.Timeout(10.0, read=None)
DYTE_API = AsyncClient(base_url='https://api.cluster.dyte.in/v2', headers={'Authorization': f"Basic {API_HASH}"}, timeout=timeout)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

fh = logging.FileHandler("app.log")
fh.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
fh.setFormatter(formatter)
logger.addHandler(fh)


class ProctorPayload(BaseModel):
    meeting_id: str
    admin_id: str

class AdminProp(BaseModel):
    meeting_id: str
    admin_id: str

class Meeting(BaseModel):
    title: str

class Participant(BaseModel):
    name: str
    preset_name: str
    meeting_id: str

origins = [
    # allow all
    "*",
]

app = FastAPI()

# enable cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # allow all
    allow_headers=["*"],  # allow all
)

def connect_to_db():
    conn = psycopg2.connect(
            dbname=os.getenv('DB_USER'), 
            user=os.getenv('DB_USER'), 
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=5432
    )
    return conn

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/is_admin/")
async def multiple_faces_list(admin: AdminProp):
    conn = connect_to_db()
    cur = conn.cursor()
    cur.execute("SELECT count(1) FROM meeting_host_info WHERE meeting_id = %s AND admin_id = %s", (admin.meeting_id, admin.admin_id,))
    
    count = cur.fetchone()[0]
    
    if(count > 0):
        return { "admin": True }
    else:
        return { "admin": False }

@app.post("/multiple_voices_list/")
async def multiple_faces_list(meeting: ProctorPayload):
    conn = connect_to_db()
    cur = conn.cursor()
    cur.execute("SELECT count(1) FROM meeting_host_info WHERE meeting_id = %s AND admin_id = %s", (meeting.meeting_id, meeting.admin_id,))
    
    count = cur.fetchone()[0]
    
    if(count > 0):
        cur.execute("CREATE TABLE IF NOT EXISTS meeting_audio_proc_details (ts TIMESTAMP, meeting_id VARCHAR(255), participant_id VARCHAR(255), audio_url VARCHAR(255), verdict VARCHAR(255))")
        cur.execute("SELECT * FROM meeting_audio_proc_details WHERE meeting_id = %s ORDER BY ts DESC", (meeting.meeting_id,))
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    else:
        conn.commit()
        cur.close()
        conn.close()
        raise HTTPException(status_code=401, detail="Participant dose not has admin role")

@app.post("/multiple_voices/")
async def multiple_voices(file: UploadFile = File(...), meeting_id: str = Form(...), participant_id: str = Form(...), participant_name: str = Form(...)):
    contents = file.file.read()
    filename = file.filename.split('.')[0] + str(random.randint(1, 100)) + '.mp3'
    with open(filename, 'wb') as f:
        f.write(contents)
    file.file.close()

    conn = connect_to_db()
    cur = conn.cursor()
    
    cur.execute("CREATE TABLE IF NOT EXISTS meeting_audio_proc_details (ts TIMESTAMP, meeting_id VARCHAR(255), participant_id VARCHAR(255), audio_url VARCHAR(255), verdict VARCHAR(255))")

    try:
        count = speakers_count(filename)
    except Exception as e:
        logger.error(e)
    
    if count > 1:
        logger.info(
            f"Detected different voices for participant {participant_id}"
        )

        verdict = f"Participant Name: {participant_name} <> Anomaly: Different Voices Detected <> Participant ID: {participant_id}"
        cur.execute("SELECT count(1) FROM meeting_audio_proc_details WHERE meeting_id=%s AND participant_id=%s AND ts >= (current_timestamp - INTERVAL '10 minutes')", (meeting_id, participant_id))
        count = cur.fetchone()[0]

        if count == 0:
            # if there is a requirement of storing audio files
            upload_resp = await upload_audio(img_data)
            cur.execute("INSERT INTO meeting_audio_proc_details (ts, meeting_id, participant_id, audio_url, verdict) VALUES (current_timestamp, %s, %s, %s, %s)", 
                (meeting_id, participant_id, upload_resp, verdict)
            )

        conn.commit()
        cur.close()
        conn.close()

        if count == 0:
            return { "id": participant_id, "different_voices_detected": True, "url": upload_resp }
        return { "id": participant_id, "different_voices_detected": True, "url": "not uploaded" }

    return {"id": participant_id, "different_voices_detected": False}

@app.post("/meetings")
async def create_meeting(meeting: Meeting):
    response = await DYTE_API.post('/meetings', json=meeting.dict())
    if response.status_code >= 300:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    admin_id = ''.join(random.choices('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=32))
    resp_json = response.json()
    resp_json['admin_id'] = admin_id
    meeting_id = resp_json['data']['id']

    conn = connect_to_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO meeting_host_info (ts, meeting_id, admin_id) VALUES (CURRENT_TIMESTAMP, %s, %s)", (meeting_id, admin_id))
    conn.commit()
    cur.close()
    conn.close()

    return resp_json


@app.post("/meetings/{meetingId}/participants")
async def add_participant(meetingId: str, participant: Participant):
    client_specific_id = f"react-samples::{participant.name.replace(' ', '-')}-{str(uuid.uuid4())[0:7]}"
    payload = participant.dict()
    payload.update({"client_specific_id": client_specific_id})
    del payload['meeting_id']
    resp = await DYTE_API.post(f'/meetings/{meetingId}/participants', json=payload)
    if resp.status_code > 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.text

if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=8000, log_level="debug", reload=True)

```

This code defines a ⚡️ FastAPI application with an endpoint `/multiple_voices` which takes in a audio file in binary format and returns a boolean value indicating if there are multiple voices in the audio submitted.

It uses the [audio_diarization api by Deepgram](https://deepgram.com/ageitgey) API service to detect multiple voices in the audio received.

`audio_diarization.py`

Code snippet below. 👇
```python
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
```

The code also makes use of the Dyte API for meeting-related operations. 📹

We can start the backend server simply by using the following command 🧑‍💻:

```bash
python app.py
```

This Python server helps us create meetings, join meetings, detect multiple voices, get the list of suspicious candidates. 🕵️

Here, when we hit the `/multiple_voices` endpoint with an audio file, the `multiple_voices_detected` key of the response would be set to `True` if there are multiple voice in the audio file received, else it would be set to `False`.

We can call this from our frontend with the participant's mic

Now, let's get back to our react application and start creating our UI ✨

## Step 6: Setting up the Meeting UI

First let us add our css file, create a new file `frontend/src/App.css` and paste the following code.
```css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

.heading-proctor {
  font-size: x-large;
  font-weight: bolder;
  color: #fff;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.file-input label {
  margin-top: 20px;
  display: block;
  position: relative;
  width: 200px;
  height: 50px;
  border-radius: 10px;
  background-color:#2160fd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: transform .2s ease-out;
}

.file {
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  position: absolute;
}
```

Next, we will add the initial Dyte Meeting component to our app. We can do this by replacing the contents of `frontend/src/App.jsx` with the following code:

```jsx
import { useEffect, useState } from 'react';
import Home from './Home';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css'
import Stage from './Stage';

const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000"

function App() {
    const [meetingId, setMeetingId] = useState()

    const createMeeting = async () => {
        const res = await fetch(`${SERVER_URL}/meetings`, {
            method: "POST",
            body: JSON.stringify({ title: "Joint Entrance Examination" }),
            headers: { "Content-Type": "application/json" }
        })
        const resJson = await res.json()
        window.localStorage.setItem("adminId", resJson.admin_id)
        setMeetingId(resJson.data.id)
    }

    useEffect(() => {
        window.localStorage.removeItem('refImgUrl')
        const id = window.location.pathname.split('/')[2]
        if(!!!id) {
            createMeeting()
        }
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home meetingId={meetingId} />}></Route>
                <Route path='/meeting/:meetingId' element={<Stage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
```

This component will create a Dyte meeting link and an `adminId` for the admin. We will store the `adminId` secretly in localstorage. The `adminId` will be used later for accessing any sensitive data.

### **Home component**

Home component renders the `/` route. Create a file as `frontend/src/Home.jsx`.

```jsx
import { Link } from "react-router-dom";
function Home({ meetingId }) {
	return (
		<div
			style={{
				height: "100vh",
				width: "100vw",
				fontSize: "x-large",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{meetingId && !window.location.pathname.split("/")[2] && (
				<Link to={`/meeting/${meetingId}`}>Create and Join Meeting</Link>
			)}
		</div>
	);
}

export default Home;
```

### **Heading component**

Now we will create a file as `frontend/src/Heading.jsx`.

```jsx
const Heading = ({ text }) => {
    return (
        <div className="heading-proctor" style={{ 
            padding: "10px", 
            textAlign: "center", 
            backgroundColor: "#000", 
            borderBottom: "solid 0.5px gray",
        }}>
            {text}
        </div>
    )
}

export default Heading
```

Let's create a staging area for participants joining the meeting. Admin bypasses the staging area but the candidate will be asked to upload a reference image of himself in this page.
Create another file `frontend/src/Stage.jsx`

```jsx
import { useState, useEffect } from "react";
import Meet from "./Meet";


const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000"

const Stage = () => {
    const [isAdminBool, setAdminBool] = useState(null);
    const meetingId = window.location.pathname.split('/')[2]

    const isAdmin = async (id) => {
        const res = await fetch(`${SERVER_URL}/is_admin`, {
            method: "POST",
            body: JSON.stringify({ admin_id: window.localStorage.getItem("adminId") || '', meeting_id: meetingId || '' }),
            headers: { "Content-Type": "application/json" }
        })
        const resJson = await res.json()
        setAdminBool(resJson.admin)
    }

    useEffect(() => {
        isAdmin()
    }, [])

    return (
        <div style={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", color: "white"}}>
            {isAdminBool == null ? <>Loading...</> : <><Meet isAdminBool={isAdminBool} /></>}
        </div>
    )
}

export default Stage
```

Now, let's delve into the `Meet` component that renders on route `/meeting/:meetingId`.

When the Admin clicks on the link provided on the `/` route, he gets redirected to the meeting page, where we add the user to the meeting as a participant with `audio_proc_preset` preset. 🤙

Since, this user created the meeting and was redirected to the meet page, we will assign him `admin` role. Now the link from the address bar can be shared with candidates.

When a candidate opens the shared link, they becomes a regular user. And for every regular user, the component starts emitting audio samples of the users to our directed to our Python server 🐍

```jsx
/* eslint-disable */

import { useState, useEffect, useRef } from 'react';
import { DyteMeeting, provideDyteDesignSystem } from '@dytesdk/react-ui-kit';
import { useDyteClient } from '@dytesdk/react-web-core';
import Proctor from './Proctor';
import Heading from './Heading';
import { joinMeeting } from './utils'
import lamejs from 'lamejstmp';

// Constants 
const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000"
let LAST_BACKEND_PING_TIME = 0;
const TIME_BETWEEN_BACKEND_PINGS = 60000;

function convertFloat32ToInt16(buffer) {
    var l = buffer.length;
    var buf = new Int16Array(l);
    while (l--) {
        buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf;
}

const Meet = () => {
    const meetingEl = useRef();
    const [meeting, initMeeting] = useDyteClient();
    const [userToken, setUserToken] = useState();
    const [isAdminBool, setAdminBool] = useState(null);
    const meetingId = window.location.pathname.split('/')[2]

    async function audioToMp3Middleware(audioContext) {
        const processor = audioContext.createScriptProcessor(1024, 1, 1);
        const encoder = new lamejs.Mp3Encoder(1, 44100, 128);
        const bufferSize = 512;
        let mp3Data = [];
    
        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const mp3buf = encoder.encodeBuffer(convertFloat32ToInt16(inputData));
            if (mp3buf.length > 0) {
                mp3Data.push(mp3buf); 
            }
            const currentTime = Date.now();
            if (mp3Data.length >= bufferSize && currentTime - LAST_BACKEND_PING_TIME > TIME_BETWEEN_BACKEND_PINGS) {
                LAST_BACKEND_PING_TIME = currentTime;
                const file = new File(mp3Data, 'audio.mp3');
                const form = new FormData();
                form.append("file", file);
                form.append("meeting_id", meetingId)
                form.append("participant_id", meeting?.self.id)
                form.append("participant_name", meeting?.self.name)
    
                fetch(`${SERVER_URL}/multiple_voices`, {
                  method: "POST",
                  body: form
                });
    
                mp3Data = [];
            }
        };
    
        return processor;
    }

    const isAdmin = async (id) => {
        const res = await fetch(`${SERVER_URL}/is_admin`, {
            method: "POST",
            body: JSON.stringify({ admin_id: window.localStorage.getItem("adminId") || '', meeting_id: meetingId || '' }),
            headers: { "Content-Type": "application/json" }
        })
        const resJson = await res.json()
        setAdminBool(resJson.admin)
    }

    const joinMeetingId = async () => {
        if (meetingId) {
            const authToken = await joinMeeting(meetingId)
            await initMeeting({
                authToken,
            });
            setUserToken(authToken)
        }
    }

    useEffect(() => {
        if (meetingId && !userToken) joinMeetingId()
        isAdmin()
    }, [])

    useEffect(() => {
        if (userToken) {
            provideDyteDesignSystem(meetingEl.current, {
                theme: 'dark'
            });
        }
    }, [userToken])

    useEffect(() => {
        if (isAdminBool === false && meeting?.self) {
            meeting.self.addAudioMiddleware(audioToMp3Middleware);
        }

        return () => {
            if (isAdminBool === false && meeting?.self) {
                meeting.self.removeAudioMiddleware(audioToMp3Middleware);
            }
        }
    }, [meeting?.self, isAdminBool]);

    return (
        <div style={{ height: "96vh", width: "100vw", display: "flex" }}>
            {userToken &&
                <>
                    {isAdminBool && <div style={{ width: "40vw", height: "100vh", overflowY: "scroll", backgroundColor: "black", borderRight: "solid 0.5px gray" }}><Heading text={"Proctoring Information"} /><Proctor meeting={meeting} /></div>}
                    {isAdminBool ? <div style={{ width: "60vw", height: "96vh" }}><Heading text={"Proctoring Admin Interface"} /><DyteMeeting mode='fill' meeting={meeting} ref={meetingEl} /></div> : <div style={{ width: "100vw", height: "96vh" }}><Heading text={"Proctoring Candidate Interface"} /><DyteMeeting mode='fill' meeting={meeting} ref={meetingEl} /></div>}
                </>
            }
        </div>
    )
}

export default Meet
```

---

Let's briefly go through some of the functions:

- `isAdmin` talks to python server to identify if the current client is Admin or not.
- `joinMeeting` adds the current client to the meeting.
- `audioToMp3Middleware` sends audio samples of candidate to the python server.

---

### **Proctor component**

Proctor component gets activated only for `admins`. Proctor component with the help of `adminId` fetches the suspicious candidates list and render it in chat like format. Create a file `frontend/src/Proctor.jsx`

```jsx
import { useEffect, useState } from "react";
import { getCandidateStatus } from "./utils";

const Proctor = () => {
    const [candidateStatuses, updateCandidateStatusState] = useState([])
    const [error, setError] = useState('')

    const updateCandidateStatus = async () => {
        try {
            const res = await getCandidateStatus()
            updateCandidateStatusState(res)
        } catch(e) {
            setError("User don't have admin privileges.")
        }
    }

    useEffect(() => {
        if(candidateStatuses?.map) {
            const id = setInterval(() => {
                updateCandidateStatus()
            }, 30000)
            return () => {
                clearInterval(id)
            }
        }
    }, [candidateStatuses])

    return(
        <>
            <div style={{ padding: "0px 20px" }}>
                {candidateStatuses?.map && candidateStatuses ? candidateStatuses.map(status => 
                    <div style={{ display: "flex", justifyContent: "start", margin: "50px 20px" }}>
                        <div style={{ marginRight: "20px"}}>
                            <img src="https://images.yourstory.com/cs/images/companies/Dyte-1608553297314.jpg" style={{ borderRadius: "50px", height: "60px", border: "1px double lightblue" }} />
                        </div>
                        <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#2160fd", fontSize: "large", fontWeight: "400", borderRadius: "10px 10px 10px 10px", width: "80%",  }} >
                            <div style={{ color: "white", padding: "20px 0px", textAlign: "left" }}>{status[4].split('<>').map(text => <div>{text}</div>)}<div>Timestamp: {(new Date(status[0])).toLocaleString()}</div></div>
                        </div>
                    </div>) : <div style={{ color: "white" }}>Wait or check if you have admin privileges to access the proctoring dashboard.</div>}
            </div>   
        </>
    )
}

export default Proctor;
```

### Utility functions

Let's add or utility functions.

Create a file `frontend/src/utils.js`.

```js
const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000"

const joinMeeting = async (id) => {
    const res = await fetch(`${SERVER_URL}/meetings/${id}/participants`, {
        method: "POST",
        body: JSON.stringify({ name: "new user", preset_name: "audio_proc_preset", meeting_id: id }),
        headers: { "Content-Type": "application/json" }
    })
    const resJson = await res.json()
    const data = JSON.parse(resJson.detail)
    return data.data.token;
}

const getCandidateStatus = async () => {
    const response = await fetch(`${SERVER_URL}/multiple_voices_list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            meeting_id: window.location.pathname.split('/')[2],
            admin_id: window.localStorage.getItem("adminId") || "undefined"
        })
    });
    const res = await response.json()
    if (res.details) return undefined
    return res
}

const FloatArray2Int16 = (floatbuffer) => {
    var int16Buffer = new Int16Array(floatbuffer.length);
    for (var i = 0, len = floatbuffer.length; i < len; i++) {
        if (floatbuffer[i] < 0) {
            int16Buffer[i] = 0x8000 * floatbuffer[i];
        } else {
            int16Buffer[i] = 0x7FFF * floatbuffer[i];
        }
    }
    return int16Buffer;
}

export {
    joinMeeting,
    getCandidateStatus,
    FloatArray2Int16
}
```

To start the React app on the local server, we can run the following command:

```bash
yarn start
```

Now, upon visiting `http://localhost:3000/`, we should be able to see the Dyte meeting in our browser.

-------- change this as well --------
![Screenshot](https://i.imgur.com/sFNSxaJ.png)

## Step 7: Adding the multiple voice detection logic to the Frontend

Since now we have a nice backend server to detect multiple voices and a great UI 🎉, we can add the multiple voice detection logic to our frontend. For this, we will first add some constants to our previously edited `frontend/src/App.jsx` file:

We will be using the above constants in the `audioToMp3Middleware` function which we will add to our `Meet` component.

The `audioToMp3Middleware` is a [Dyte Audio](https://dyte.io/blog/streams-blog/) [Middleware](https://docs.dyte.io/web-core/local-user/extras#using-middlewares). Middlewares are add-ons that we can use to add effects and filters to your audio and video streams with ease.

Here, we are using the middleware functionality to get the audio sample from participant's mic, and send it to our backend server. We are also ensuring that the backend is pinged only once every 60 seconds to avoid unnecessary load on the server.

That was all the code we needed to add a basic proctoring functionality to our Dyte meeting. 👍

The app sends a audio sample from the participant's mic to the backend server every 60 seconds and if the backend detects multiple voices in the audio sample, it sends a warning notification to the projector. ⚠️

Additionally, the backend also logs the participant's ID and the time of the detection in the terminal. This can be used to keep track of the participants who may be cheating in the meeting, for later review.

## Step 8: Trying out our project

Ta-da! 🎩✨ It's time to put our proctoring system to the test and see it in action!

- First let us take a look at the candidate's view, the candidate can see that the proctor is in the meet, but could not see the Proctoring Panel. 🧑‍💻

------ change the screenshot here ------
![Cadidate's Interface](https://i.imgur.com/xPf5qak.png)

- We may see here, in the proctor's view, we can see the details (proctoring information) along with proof when 2 or more people are talking in the candidate's background. 🙌 

--- changes are required here as well -----
![Proctor's Interface](https://i.imgur.com/30vSWHz.png)

Here's the link to the repository for you to take a look at the whole codebase 👉 <REPO_LINK>

## Conclusion

Celebrate! 🎉✨ We've built a powerful proctoring system with Dyte, ensuring integrity and fairness in online exams and interviews. But that's not all! We can now create our own customized online classroom or meeting platform.

We can now use this system to proctor our online exams and interviews. ✍️

The possibilities are endless with Dyte, go ahead and try bringing your own ideas to life by visiting [dyte.io](https://dyte.io/)! 🚀