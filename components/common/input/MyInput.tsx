import { TextInput, TextInputProps } from "react-native";
import { BUTTON_SIZE_STYLE, StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";

interface MyInputProps extends TextInputProps {
    size?: StyleSizeType;
    hasError?: boolean;
}

function MyInput({
    size = "medium",
    hasError,
    placeholderClassName,
    className,
    ...props
}: MyInputProps) {
    return (
        <TextInput
            className={twMerge(
                "w-full bg-background-default rounded-lg border text-text-default",
                BUTTON_SIZE_STYLE[size],
                hasError ? "border-error-main" : "border-divider focus:border-primary-main",
                className,
            )}
            placeholderClassName={twMerge("text-text-secondary", placeholderClassName)}
            {...props}>
        </TextInput>
    );
}

export default MyInput;
