import { Pressable, PressableProps, Text } from "react-native";
import { StyleColorType, StyleSizeType, StyleVariantType } from "@/types/style";

interface Props extends PressableProps {
    color?: StyleColorType;
    variant?: StyleVariantType;
    size?: StyleSizeType;
    fullWidth?: boolean;
}

function MyButton({
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
            case "text":
                return `bg-transparent`;
            case "outlined":
                return `border border-${color}-main bg-transparent`;
            case "icon":
                return `rounded-full p-2`;
        }
    };

    const getTextColorClasses = () => {
        if (variant === "contained") return `text-${color}-contrast`;
        return `text-${color}-main`;
    };

    const BUTTON_SIZE_STYLE = {
        small: "px-2 py-1",
        medium: "px-3 py-2",
        large: "px-5 py-3",
    };

    const TEXT_SIZE_STYLE = {
        small: "text-xs",
        medium: "text-sm",
        large: "text-base",
    };

    return (
        <Pressable
            className={`flex items-center justify-center rounded-md ${getVariantClasses()} ${getTextColorClasses()} ${fullWidth ? "w-full" : ""} ${BUTTON_SIZE_STYLE[size]} ${className}`}
            {...props}>
            {typeof children === "string" ? (
                <Text className={`${getTextColorClasses()} ${TEXT_SIZE_STYLE[size]} font-bold`}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </Pressable>
    );
}

export default MyButton;
