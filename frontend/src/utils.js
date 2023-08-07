const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8000"

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