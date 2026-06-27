import { Platform, TextInput, TextInputProps } from "react-native";
import { StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";

interface TextAreaProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
}

function TextArea({
    hasError,
    size = "medium",
    placeholderClassName,
    className,
    ...props
}: TextAreaProps) {
    const getTextSizeClasses = () => {
        switch (size) {
            case "small":
                return `text-xs`;
            case "medium":
                return `text-sm`;
            case "large":
                return `text-base`;
        }
    };

    // textAlignVertical : 안드로이드에서 TextInput에 입력하는 텍스트는 y축 중앙에 정렬됨
    return (
        <TextInput
            multiline={true}
            textAlignVertical={"top"}
            className={twMerge(
                ["w-full", "p-4", "min-h-32"],
                ["bg-background-default", "rounded-lg", "border", "text-text-default"],
                getTextSizeClasses(),
                hasError ? "border-error-default" : "border-divider focus:border-primary-main",
                Platform.OS === "web" && "outline-none",
                className,
            )}
            placeholderClassName={twMerge("text-text-secondary", placeholderClassName)}
            {...props}
        />
    );
}

export default TextArea;
