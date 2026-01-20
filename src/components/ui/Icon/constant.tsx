/** @format */

export const icons = {
    check: (
        <svg
            className="h-4 w-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
            />
        </svg>
    ),
    location: (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10 5C10 7.4965 7.2305 10.0965 6.3005 10.8995C6.12252 11.0333 5.87748 11.0333 5.6995 10.8995C4.7695 10.0965 2 7.4965 2 5C2 2.79234 3.79234 1 6 1C8.20766 1 10 2.79234 10 5"
                stroke="#90A1B9"
            />
            <path
                d="M4.5 5C4.5 5.82787 5.17213 6.5 6 6.5C6.82787 6.5 7.5 5.82787 7.5 5C7.5 4.17213 6.82787 3.5 6 3.5C5.17213 3.5 4.5 4.17213 4.5 5V5"
                stroke="#90A1B9"
            />
        </svg>
    ),
    date: (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M4 1V3" stroke="#90A1B9" />
            <path d="M8 1V3" stroke="#90A1B9" />
            <path
                d="M2.5 2H9.5C10.0519 2 10.5 2.44808 10.5 3V10C10.5 10.5519 10.0519 11 9.5 11H2.5C1.94808 11 1.5 10.5519 1.5 10V3C1.5 2.44808 1.94808 2 2.5 2V2"
                stroke="#90A1B9"
            />
            <path d="M1.5 5H10.5" stroke="#90A1B9" />
        </svg>
    ),
    edit: (
        <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.108 1.94173C16.4746 0.575511 18.6926 0.575154 20.0588 1.94173C21.3394 3.22287 21.4187 5.25233 20.2978 6.62666L20.0575 6.89253L7.82214 19.1306C7.5034 19.4483 7.11134 19.6831 6.68079 19.814L2.69006 21.0239H2.68738C2.20308 21.1694 1.67831 21.0374 1.32043 20.6801C0.962655 20.3228 0.829215 19.7977 0.973998 19.3132L0.975341 19.3105L2.18652 15.3211V15.3184C2.30218 14.9412 2.49761 14.5935 2.75854 14.2993L2.87402 14.1771L15.108 1.94173ZM18.7617 3.2375C18.152 2.62788 17.1845 2.58988 16.53 3.12337L16.4038 3.2375L4.16846 15.4755C4.06231 15.5815 3.98419 15.7122 3.94018 15.8555L3.93884 15.8542L2.97876 19.0191L6.1477 18.059L6.25244 18.0201C6.35425 17.9749 6.44693 17.9111 6.52637 17.8321L18.7617 5.59541L18.8759 5.46919C19.4093 4.8148 19.3714 3.8473 18.7617 3.2375Z"
                fill="currentColor"
            />
            <path
                d="M13.1015 3.93475C13.4595 3.57676 14.0406 3.57676 14.3986 3.93475L18.0644 7.60186C18.4224 7.95984 18.4224 8.53966 18.0644 8.89764C17.7064 9.25562 17.1266 9.25562 16.7686 8.89764L13.1015 5.23186C12.7435 4.87388 12.7435 4.29273 13.1015 3.93475Z"
                fill="currentColor"
            />
        </svg>
    ),
    delete: (
        <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8.24951 15.5833V10.0833C8.24951 9.57705 8.66036 9.1662 9.16663 9.1662C9.67289 9.1662 10.0837 9.57705 10.0837 10.0833V15.5833C10.0837 16.0896 9.67289 16.5004 9.16663 16.5004C8.66036 16.5004 8.24951 16.0896 8.24951 15.5833Z"
                fill="currentColor"
            />
            <path
                d="M11.9163 15.5833V10.0833C11.9163 9.57705 12.3271 9.1662 12.8334 9.1662C13.3396 9.1662 13.7505 9.57705 13.7505 10.0833V15.5833C13.7505 16.0896 13.3396 16.5004 12.8334 16.5004C12.3271 16.5004 11.9163 16.0896 11.9163 15.5833Z"
                fill="currentColor"
            />
            <path
                d="M3.66626 18.3329V5.5C3.66626 4.99374 4.07711 4.58289 4.58337 4.58289C5.08964 4.58289 5.50049 4.99374 5.50049 5.5V18.3329C5.50049 18.8383 5.91088 19.2498 6.41626 19.25H15.5834C16.089 19.25 16.5005 18.8385 16.5005 18.3329V5.5C16.5005 4.99389 16.9102 4.58313 17.4163 4.58289C17.9225 4.58289 18.3334 4.99374 18.3334 5.5V18.3329C18.3334 19.851 17.1015 21.0829 15.5834 21.0829H6.41626C4.89836 21.0826 3.66626 19.8508 3.66626 18.3329Z"
                fill="currentColor"
            />
            <path
                d="M19.25 4.58289C19.7563 4.58289 20.1671 4.99374 20.1671 5.5C20.1671 6.00626 19.7563 6.41711 19.25 6.41711H2.75C2.24374 6.41711 1.83289 6.00626 1.83289 5.5C1.83289 4.99374 2.24374 4.58289 2.75 4.58289H19.25Z"
                fill="currentColor"
            />
            <path
                d="M13.7505 5.50043V3.6662C13.7502 3.16082 13.3388 2.75043 12.8334 2.75043H9.16626C8.66103 2.75067 8.25073 3.16097 8.25049 3.6662V5.50043C8.25025 6.00648 7.83949 6.4162 7.33337 6.4162C6.82726 6.4162 6.4165 6.00648 6.41626 5.50043V3.6662C6.4165 2.14845 7.64851 0.916441 9.16626 0.916199H12.8334C14.3513 0.916199 15.5831 2.1483 15.5834 3.6662V5.50043C15.5831 6.00648 15.1724 6.4162 14.6663 6.4162C14.1604 6.41596 13.7507 6.00633 13.7505 5.50043Z"
                fill="currentColor"
            />
        </svg>
    ),
    info: (
        <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="36" height="36" rx="12" fill="#EEF2FF" />
            <path
                d="M9.66663 18C9.66663 22.5993 13.4007 26.3333 18 26.3333C22.5993 26.3333 26.3333 22.5993 26.3333 18C26.3333 13.4007 22.5993 9.66663 18 9.66663C13.4007 9.66663 9.66663 13.4007 9.66663 18V18"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18 21.3333V18"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18 14.6666H18.0083"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    assets: (
        <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="36" height="36" rx="12" fill="#EEF2FF" />
            <path
                d="M12.1667 10.5H23.8333C24.7538 10.5 25.5 11.2462 25.5 12.1667V23.8333C25.5 24.7538 24.7538 25.5 23.8333 25.5H12.1667C11.2462 25.5 10.5 24.7538 10.5 23.8333V12.1667C10.5 11.2462 11.2462 10.5 12.1667 10.5V10.5"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.8333 15.5C13.8333 16.4198 14.5801 17.1666 15.4999 17.1666C16.4198 17.1666 17.1666 16.4198 17.1666 15.5C17.1666 14.5801 16.4198 13.8333 15.4999 13.8333C14.5801 13.8333 13.8333 14.5801 13.8333 15.5V15.5"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M25.5 20.5L22.9283 17.9283C22.2775 17.2777 21.2225 17.2777 20.5717 17.9283L13 25.5"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    show: (
        <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="36" height="36" rx="12" fill="#EEF2FF" />
            <path
                d="M9.71835 18.2901C9.6489 18.103 9.6489 17.8972 9.71835 17.7101C11.1017 14.3558 14.3717 12.1672 18 12.1672C21.6283 12.1672 24.8983 14.3558 26.2817 17.7101C26.3511 17.8972 26.3511 18.103 26.2817 18.2901C24.8983 21.6443 21.6283 23.8329 18 23.8329C14.3717 23.8329 11.1017 21.6443 9.71835 18.2901"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15.5 18C15.5 19.3798 16.6202 20.5 18 20.5C19.3798 20.5 20.5 19.3798 20.5 18C20.5 16.6202 19.3798 15.5 18 15.5C16.6202 15.5 15.5 16.6202 15.5 18V18"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    classification: (
        <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="36" height="36" rx="12" fill="#EEF2FF" />
            <path
                d="M18.8333 12.1667H25.4999"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18.8333 18H25.4999"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18.8333 23.8333H25.4999"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.5 22.1667L12.1667 23.8333L15.5 20.5"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.5 13.8334L12.1667 15.5L15.5 12.1667"
                stroke="#728FC0"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    shieldCheck: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2L4 5V11C4 16.19 7.41 21.05 12 22.5C16.59 21.05 20 16.19 20 11V5L12 2Z"
                fill="#728FC0"
            />
            <path
                d="M9 12L11 14L15 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    externalLink: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11"
                stroke="#CAD5E2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15 3H21V9"
                stroke="#CAD5E2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10 14L21 3"
                stroke="#CAD5E2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
}
