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
        const bufferSize = 128; // change this to match your sample size
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
        if (meeting?.self) {
            meeting.self.addAudioMiddleware(audioToMp3Middleware);
        }

        return () => {
            if (meeting?.self) {
                meeting.self.removeAudioMiddleware(audioToMp3Middleware);
            }
        }
    }, [meeting?.self]);

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