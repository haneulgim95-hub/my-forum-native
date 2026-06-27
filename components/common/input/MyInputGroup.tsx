import { TextInputProps, View } from "react-native";
import Label from "@/components/common/form/Label";
import { StyleSizeType } from "@/types/style";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import MyInput from "@/components/common/input/MyInput";
import { twMerge } from "tailwind-merge";

interface MyInputGroupProps extends TextInputProps {
    wrap?: boolean;
    label?: string;
    size?: StyleSizeType;
    errorMessage?: string;
}

function MyInputGroup({
    wrap = false,
    label,
    size = "medium",
    errorMessage,
    className,
    ...props
}: MyInputGroupProps) {
    return (
        <View className={twMerge("w-full mb-4", wrap && "flex-1", className)}>
            {label && <Label size={size}>{label}</Label>}
            <MyInput hasError={!!errorMessage} size={size} {...props} />
            {errorMessage && <ErrorMessage size={size}>{errorMessage}</ErrorMessage>}
        </View>
    );
}

export default MyInputGroup;
