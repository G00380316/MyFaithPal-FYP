import { useEffect, useState } from "react";

const useBackendData = () => {

    const [backendData, setBackendData] = useState([{}])
    
    useEffect(() => {
        fetch("/api").then(
            Response => Response.json()
        ).then(
            data => {
                setBackendData(data)
            }
        )
    },[])
}

export default useBackendData;