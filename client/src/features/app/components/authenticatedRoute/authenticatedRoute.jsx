import React from 'react'
import Cookies from "js-cookie"

export default function AuthenticatedRoute({ children }) {
    const authToken = Cookies.get("authToken");
    return (
        <>
            <p>{authToken}</p>
            {
                authToken === "undefined" || authToken === undefined || authToken === null || authToken === "" ? (
                    <p style={{
                        position: 'absolute',
                        fontSize: '3rem',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontFamily: 'sans-serif',
                    }}>
                        Loading<span style={{ color: "white", marginLeft: "5px" }}>&#9679; &#9679; &#9679;</span>
                    </p>
                ) : (
                    children
                )
            }
        </>
    )
}
