import { useState, useEffect } from "react";
import ImageUploader from "./ImageInput";
import Meet from "./Meet";


const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000"

const Stage = () => {
    const [isAdminBool, setAdminBool] = useState(null);
    const [isRefImgUploaded, setImgUploadedStatus] = useState(null);
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
            {/* {isAdminBool == null ? <>Loading...</> : <>{(isAdminBool || (isAdminBool === false && isRefImgUploaded )) ? <Meet isAdminBool={isAdminBool} /> : <ImageUploader setImgUploadedStatus={setImgUploadedStatus}/>}</>} */}
            <Meet isAdminBool={isAdminBool} />
        </div>
    )
}

export default Stage