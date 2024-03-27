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
        <svg xmlns="http://www.w3.org/2000/svg" fill={color} width={sizes} height={sizes} viewBox="0 0 56 56"><path d="M 28.0117 27.3672 C 33.0508 27.3672 37.3867 22.8672 37.3867 17.0078 C 37.3867 11.2187 33.0274 6.9297 28.0117 6.9297 C 22.9961 6.9297 18.6367 11.3125 18.6367 17.0547 C 18.6367 22.8672 22.9961 27.3672 28.0117 27.3672 Z M 13.2930 49.0703 L 42.7305 49.0703 C 46.4101 49.0703 47.7226 48.0156 47.7226 45.9531 C 47.7226 39.9062 40.1523 31.5625 28.0117 31.5625 C 15.8477 31.5625 8.2774 39.9062 8.2774 45.9531 C 8.2774 48.0156 9.5898 49.0703 13.2930 49.0703 Z" /></svg>
    )
}

export const LikedInIcon = ({ sizes, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill={color} width={sizes} height={sizes} version="1.1" id="Layer_1" viewBox="-143 145 512 512">
            <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M41.4,508.1H-8.5V348.4h49.9  V508.1z M15.1,328.4h-0.4c-18.1,0-29.8-12.2-29.8-27.7c0-15.8,12.1-27.7,30.5-27.7c18.4,0,29.7,11.9,30.1,27.7  C45.6,316.1,33.9,328.4,15.1,328.4z M241,508.1h-56.6v-82.6c0-21.6-8.8-36.4-28.3-36.4c-14.9,0-23.2,10-27,19.6  c-1.4,3.4-1.2,8.2-1.2,13.1v86.3H71.8c0,0,0.7-146.4,0-159.7h56.1v25.1c3.3-11,21.2-26.6,49.8-26.6c35.5,0,63.3,23,63.3,72.4V508.1z  " />
        </svg>
    )
}

export const GithubIcon = ({ sizes, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={sizes} height={sizes} viewBox="0 0 20 20" version="1.1">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill={color}>
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                        <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]">

                        </path>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export const EmailIcon = ({ sizes, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill={color} width={sizes} height={sizes} viewBox="0 0 1920 1920">
            <path d="M1920 428.266v1189.54l-464.16-580.146-88.203 70.585 468.679 585.904H83.684l468.679-585.904-88.202-70.585L0 1617.805V428.265l959.944 832.441L1920 428.266ZM1919.932 226v52.627l-959.943 832.44L.045 278.628V226h1919.887Z" fillRule="evenodd" />
        </svg>
    )
}