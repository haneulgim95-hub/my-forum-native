import { PropsWithChildren } from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";

interface TitleProps extends PropsWithChildren {
    title: string;
    description?: string;
    className?: string;
}

function Title({ title, description, className, children }: TitleProps) {
    return (
        <View
            className={twMerge(
                ["flex-col", "md:flex-row", "justify-between", "md:items-center", "gap-4"],
                ["md:gap-0", "w-full", "mb-6", "pb-4"],
                ["border-b", "border-divider"],
                className,
            )}>
            <View className={twMerge("w-full", "md:flex-1")}>
                <TextComponent className={twMerge("text-2xl", "font-extrabold")}>
                    {title}
                </TextComponent>
                {description && (
                    <TextComponent className={twMerge("text-sm", "text-text-secondary", "mt-1")}>
                        {description}
                    </TextComponent>
                )}
            </View>

            {children && (
                <View
                    className={twMerge(
                        ["flex-row", "justify-start", "md:justify-end"],
                        ["w-full", "md:w-auto", "md:ml-4"],
                    )}>
                    {children}
                </View>
            )}
        </View>
    );
}

export default Title;
