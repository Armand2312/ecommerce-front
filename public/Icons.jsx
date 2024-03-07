export const CartIcon = ({ sizes, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={sizes} height={sizes} viewBox="0 0 24 24" fill="none" >
            <path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const InfoIcon = ({ sizes, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={sizes} height={sizes} viewBox="0 0 48 48">
            <title>information-circle</title>
            <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                    <rect width="48" height="48" fill="none" />
                </g>
                <g id="icons_Q2" data-name="icons Q2">
                    <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2Zm0,40A18,18,0,1,1,42,24,18.1,18.1,0,0,1,24,42Z" />
                    <path d="M24,20a2,2,0,0,0-2,2V34a2,2,0,0,0,4,0V22A2,2,0,0,0,24,20Z" />
                    <circle cx="24" cy="14" r="2" />
                </g>
            </g>
        </svg>
    )
}