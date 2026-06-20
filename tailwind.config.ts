import { Config } from "prettier";

export default {
    // darkMode를 어떠한 방식으로 사용하게 될건지를 결정
    darkMode: "class",
    // tailwindcss가 클래스를 구성할 때 참고해야 되는 코드들의 위치
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    plugins: [],
    theme: {
        extend: {
            colors: {
                /* 이 부분에 내가 원하는 컬러 팔레트를 마음대로 적으면 됨 */
                background: {
                    default: "var(--bg-default)",
                    paper: "var(--bg-paper)",
                },
                text: {
                    default: "var(--text-default)",
                    secondary: "var(--text-secondary)",
                },
                divider: "var(--divider)",
                primary: {
                    main: "var(--primary-main)",
                    contrast: "var(--primary-contrast)",
                },
                secondary: {
                    main: "var(--secondary-main)",
                    contrast: "var(--secondary-contrast)",
                },
                error: {
                    main: "var(--error-main)",
                    contrast: "var(--error-contrast)",
                },
                success: {
                    main: "var(--success-main)",
                    contrast: "var(--success-contrast)",
                },
                warning: {
                    main: "var(--warning-main)",
                    contrast: "var(--warning-contrast)",
                },
                info: {
                    main: "var(--info-main)",
                    contrast: "var(--info-contrast)",
                },
            },
        },
    },
} satisfies Config;