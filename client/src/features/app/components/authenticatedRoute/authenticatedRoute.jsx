import React from 'react'
import useCookie from '../../../../hooks/useCookie';

export default function AuthenticatedRoute({ children }) {
    const [authToken, updateAuthToken, removeAuthToken] = useCookie("authToken");
    return (
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

    )
}
