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

export const HamburgerIcon = ({ sizes, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={sizes} height={sizes} viewBox="0 0 24 24" fill="none">
            <g id="Menu / Hamburger_LG">
                <path id="Vector" d="M3 17H21M3 12H21M3 7H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    )
}

export const BackIcon = ({ sizes, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={sizes} height={sizes} viewBox="-19.04 0 75.804 75.804">
            <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
                <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill={color} />
            </g>
        </svg>
    )
}

export const HomeIcon = ({ sizes, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={sizes} height={sizes} viewBox="0 0 24 24" fill="none">
            <path d="M19 10L19 20H9M5 20L5 10L12 3L15.5 6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const ProductsIcon = ({ sizes, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={sizes} height={sizes} viewBox="0 0 24 24" fill="none">
            <path d="M3 6C3 4.34315 4.34315 3 6 3H7C8.65685 3 10 4.34315 10 6V7C10 8.65685 8.65685 10 7 10H6C4.34315 10 3 8.65685 3 7V6Z" stroke={color} strokeWidth="2" />
            <path d="M14 6C14 4.34315 15.3431 3 17 3H18C19.6569 3 21 4.34315 21 6V7C21 8.65685 19.6569 10 18 10H17C15.3431 10 14 8.65685 14 7V6Z" stroke={color} strokeWidth="2" />
            <path d="M14 17C14 15.3431 15.3431 14 17 14H18C19.6569 14 21 15.3431 21 17V18C21 19.6569 19.6569 21 18 21H17C15.3431 21 14 19.6569 14 18V17Z" stroke={color} strokeWidth="2" />
            <path d="M3 17C3 15.3431 4.34315 14 6 14H7C8.65685 14 10 15.3431 10 17V18C10 19.6569 8.65685 21 7 21H6C4.34315 21 3 19.6569 3 18V17Z" stroke={color} strokeWidth="2" />
        </svg>
    )
}

export const AccountIcon = ({ sizes, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill={color} width={sizes} height={sizes} viewBox="0 0 56 56"><path d="M 28.0117 27.3672 C 33.0508 27.3672 37.3867 22.8672 37.3867 17.0078 C 37.3867 11.2187 33.0274 6.9297 28.0117 6.9297 C 22.9961 6.9297 18.6367 11.3125 18.6367 17.0547 C 18.6367 22.8672 22.9961 27.3672 28.0117 27.3672 Z M 13.2930 49.0703 L 42.7305 49.0703 C 46.4101 49.0703 47.7226 48.0156 47.7226 45.9531 C 47.7226 39.9062 40.1523 31.5625 28.0117 31.5625 C 15.8477 31.5625 8.2774 39.9062 8.2774 45.9531 C 8.2774 48.0156 9.5898 49.0703 13.2930 49.0703 Z"/></svg>
    )
}