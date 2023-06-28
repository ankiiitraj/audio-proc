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
        updateCandidateStatus()
    }, [])

    useEffect(() => {
        if(candidateStatuses?.map) {
            const id = setInterval(() => {
                // updateCandidateStatus()
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
                            <img style={{ borderRadius: "10px", width: "100%" }} src={status[3]} />
                        </div>
                    </div>) : <div style={{ color: "white" }}>Wait or check if you have admin privileges to access the proctoring dashboard.</div>}
            </div>   
        </>
    )
}

export default Proctor;