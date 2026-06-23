import { Pressable, PressableProps, Text } from "react-native";
import { BUTTON_SIZE_STYLE, StyleColorType, StyleSizeType, StyleVariantType } from "@/types/style";
import { twMerge } from "tailwind-merge";

interface Props extends PressableProps {
    color?: StyleColorType;
    variant?: StyleVariantType;
    size?: StyleSizeType;
    fullWidth?: boolean;
}

function Button({
    color = "primary",
    variant = "contained",
    size = "medium",
    fullWidth = false,
    className,
    children,
    ...props
}: Props) {
    const getVariantClasses = () => {
        switch (variant) {
            case "contained":
                return `bg-${color}-main`;
            case "outlined":
                return `border border-${color}-main bg-transparent`;
            case "text":
                return `bg-transparent`;
            case "icon":
                return `rounded-full p-2`;
        }
    };

    const getTextColorClasses = () => {
        if (variant === "contained") return `text-${color}-contrast`;
        return `text-${color}-main`;
    };

    return (
        <Pressable
            className={twMerge(
                "flex justify-center items-center rounded-md font-bold",
                BUTTON_SIZE_STYLE[size],
                getVariantClasses(),
                getTextColorClasses(),
                fullWidth ? "w-full" : "",
                className,
            )}
            {...props}>
            {typeof children === "string" ? (
                <Text
                    className={twMerge(
                        "font-bold text-sm",
                        getTextColorClasses(),
                        size === "small" ? "text-xs" : size === "large" ? "text-base" : "text-sm",
                    )}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </Pressable>
    );
}

export default Button;
