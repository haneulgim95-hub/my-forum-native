import { ReactNode, useState } from "react";
import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { Feather } from "@expo/vector-icons";

interface AccordionProps {
    title: string;
    children: ReactNode;
    defaultExpanded?: boolean; // 처음 시작부터 펼처져 있을꺼니?
    className?: string; // 아코디언 전체를 감싸는 컨테이너 스타일 지정
    headerClassName?: string; // title 출력 헤더 영억 스타일 지정
    contentClassName?: string; // 펼쳐지는 영역 스타일 지정
}

function Accordion({
    title,
    children,
    defaultExpanded = false,
    className,
    headerClassName,
    contentClassName,
}: AccordionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <View className={twMerge("w-full", "overflow-hidden", className)}>
            {/* 헤더 영역  */}
            <Pressable
                onPress={() => setIsExpanded(!isExpanded)}
                className={twMerge(
                    ["flex-row", "justify-between", "items-center"],
                    ["p-4", "active:bg-divider", "transition-all"],
                    isExpanded && ["border-b", "border-divider"],
                    headerClassName,
                )}>
                <TextComponent className={twMerge("font-medium")}>{title}</TextComponent>
                <Feather
                    name={isExpanded ? "chevron-down" : "chevron-right"}
                    size={20}
                    className={"text-text-secondary"}
                />
            </Pressable>
            {/* 내용 영역   */}
            {isExpanded && (
                <View
                    className={twMerge(
                        ["bg-background-paper", "py-1"],
                        ["border-b", "border-divider"],
                        contentClassName,
                    )}>
                    {children}
                </View>
            )}
        </View>
    );
}

export default Accordion;
