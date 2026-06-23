import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

function Card({ className, children, ...props }: ViewProps) {
    return (
        <View
            className={twMerge(
                ["p-8"],
                ["bg-background-paper", "border", "border-divider", "rounded-xl", "shadow-sm"],
                className,
            )}
            {...props}>
            {children}
        </View>
    );
}

export default Card;
