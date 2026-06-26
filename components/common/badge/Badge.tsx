import { StyleColorType, StyleSizeType, StyleVariantType } from "@/types/style";
import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";

interface BadgeProps extends ViewProps {
    color?: StyleColorType;
    variant?: StyleVariantType;
    size?: StyleSizeType;
}

function Badge({
    color = "primary",
    variant = "outlined",
    size = "medium",
    className,
    children,
    ...props
}: BadgeProps) {
    const getContainerClasses = () => {
        switch (variant) {
            case "contained":
                return `bg-${color}-main border border-${color}-main`;
            case "outlined":
                return `bg-transparent border border-${color}-main`;
            default:
                return `bg-transparent border border-transparent`;
        }
    };

    const getTextColorClasses = () => {
        if (variant === "contained") return `text-${color}-contrast`;
        return `text-${color}-main`;
    };

    const getSizeClasses = () => {
        switch (size) {
            case "small":
                return `px-2 py-0.5 text-xs`;
            case "medium":
                return `px-2.5 py-1 text-sm`;
            case "large":
                return "px-3 py-1.5 text-base";
        }
    };

    return (
        <View
            className={twMerge(
                ["justify-center", "items-center", "flex-row"],
                ["rounded-full"],
                getContainerClasses(),
                getSizeClasses(),
                className,
            )}
            {...props}>
            {/* 사용할 때  children에 그냥 string이 들어올 경우, 그대로 출력해주면 React-Native에서는 에러 */}
            {typeof children === "string" ? (
                <TextComponent className={twMerge("font-bold", getTextColorClasses())}>
                    {children}
                </TextComponent>
            ) : (
                children
            )}
        </View>
    );
}

export default Badge;
