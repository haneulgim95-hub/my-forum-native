import { StyleColorType, StyleSizeType } from "@/types/style";
import { Pressable, useWindowDimensions, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";

interface PaginationProps {
    currentPage: number; // 현재 사용자가 위치한 페이지 번호
    totalPage: number; // 전체 페이지 매 수
    onPageChange: (page: number) => void; // 페이지 변경 시 호출되는 콜백 함수
    maxVisiblePages?: number; // 화면에 보여질 페이지 버튼 수
    size?: StyleSizeType;
    color?: StyleColorType;
    shape?: "rounded" | "square";
}

function Pagination({
    currentPage,
    totalPage,
    onPageChange,
    maxVisiblePages,
    size = "medium",
    color = "primary",
    shape = "square",
}: PaginationProps) {
    if (totalPage <= 1) {
        return null;
    }

    // maxVisiblePages가 주어진다면, 화면엔 그 만큼의 버튼을 출력할 것이고
    // 만약, 그 값이 없다면 PC와 모바일에 맞추어 갯수를 조절할 것임
    // -> 지금 사용자가 보고 있는 화면 크기가 얼마만한지를 알아야 함
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const displayPages = maxVisiblePages ?? (isMobile ? 5 : 10);

    const currentBlock = Math.ceil(currentPage / displayPages);
    const startPage = (currentBlock - 1) * displayPages + 1;
    const endPage = Math.min(startPage + displayPages - 1, totalPage);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const getContainerSizeClasses = () => {
        switch (size) {
            case "small":
                return "min-w-8 h-8 px-1";
            case "medium":
                return "min-w-9 h-9 px-1.5";
            case "large":
                return "min-w-10 h-10 px-2";
        }
    };

    const getTextSizeClasses = () => {
        switch (size) {
            case "small":
                return "text-xs";
            case "medium":
                return "text-sm";
            case "large":
                return "text-base";
        }
    };

    const getIconSize = () => {
        switch (size) {
            case "small":
                return 16;
            case "medium":
                return 18;
            case "large":
                return 22;
        }
    };

    const getContainerColorClasses = () => {
        switch (color) {
            case "primary":
                return "bg-primary-main border-primary-main";
            case "secondary":
                return "bg-secondary-main border-secondary-main";
            case "error":
                return "bg-error-main border-error-main";
            case "success":
                return "bg-success-main border-success-main";
            case "warning":
                return "bg-warning-main border-warning-main";
            case "info":
                return "bg-info-main border-info-main";
        }
    };

    const getTextColorClasses = () => {
        switch (color) {
            case "primary":
                return "text-primary-contrast;";
            case "secondary":
                return "text-secondary-contrast;";
            case "error":
                return "text-error-contrast;";
            case "success":
                return "text-success-contrast;";
            case "warning":
                return "text-warning-contrast;";
            case "info":
                return "text-info-contrast;";
        }
    };

    const shapeClasses = shape === "rounded" ? "rounded-full" : "rounded-md";

    return (
        <View
            className={twMerge(
                ["flex-row", "justify-center", "items-center"],
                ["gap-1", "md:gap-2"],
                "mt-8",
            )}>
            <Pressable
                onPress={() => onPageChange(currentPage - 1)}
                className={twMerge(
                    ["justify-center", "items-center"],
                    ["border", "border-divider", "bg-background-paper"],
                    shapeClasses,
                    getContainerSizeClasses(),
                    currentPage === 1
                        ? "opacity-50"
                        : "hover:bg-background-default active:bg-divider",
                )}
                disabled={currentPage === 1}>
                <Feather
                    name={"chevron-left"}
                    size={getIconSize()}
                    className={"text-text-secondary"}
                />
            </Pressable>

            {pageNumbers.map(item => {
                const isActive = item === currentPage;
                return (
                    <Pressable
                        key={item}
                        onPress={() => onPageChange(item)}
                        className={twMerge(
                            ["justify-center", "items-center", "border", "transition-all"],
                            shapeClasses,
                            getContainerSizeClasses(),
                            isActive
                                ? getContainerColorClasses()
                                : "bg-background-paper border-divider hover:bg-background-default active:bg-divider",
                        )}>
                        <TextComponent
                            className={twMerge([
                                "font-bold",
                                getTextSizeClasses(),
                                isActive ? getTextColorClasses() : "text-text-default",
                            ])}>
                            {item}
                        </TextComponent>
                    </Pressable>
                );
            })}

            <Pressable
                onPress={() => onPageChange(currentPage + 1)}
                className={twMerge(
                    ["justify-center", "items-center"],
                    ["border", "border-divider", "bg-background-paper"],
                    shapeClasses,
                    getContainerSizeClasses(),
                    currentPage === totalPage
                        ? "opacity-50"
                        : "hover:bg-background-default active:bg-divider",
                )}
                disabled={currentPage === totalPage}>
                <Feather
                    name={"chevron-right"}
                    size={getIconSize()}
                    className={"text-text-secondary"}
                />
            </Pressable>
        </View>
    );
}

export default Pagination;
