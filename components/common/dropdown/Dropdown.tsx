import { Platform, Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { ReactNode, useState } from "react";

interface DropdownProps {
    trigger: ReactNode; // 화면에 출력되는 버튼역할 컴포넌트가 들어가는 props
    // children에 컴포넌트를 그냥 집어넣을 수도 있고
    // close: () => {}라는 매개변수 함수를 받아서 컴포넌트를 리턴하는 것을 넣을 수도 있다.
    children: ReactNode | ((close: () => void) => ReactNode);
    className?: string;
    dropdownClassName?: string;
}

function Dropdown({ trigger, children, className, dropdownClassName }: DropdownProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const close = () => setIsOpen(false);

    return (
        <View className={twMerge("relative", "z-50", className)}>
            <Pressable onPress={() => setIsOpen(!isOpen)}>{trigger}</Pressable>

            {isOpen && (
                <>
                    {/*     백드롭 : 외부를 클릭하면 닫히도록 하기 위함*/}
                    <Pressable
                        onPress={close}
                        className={"z-40"}
                        style={
                            Platform.OS === "web"
                                ? // fixed, sticky는 웹에는 있고 앱에는 없음
                                  {
                                      // 웹에서는 화면 전체를 감 싸기 위해
                                      // fixed를 하고 각 네 귀퉁이를 잡아주면 됨
                                      position: "fixed",
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                  }
                                : {
                                      // 앱에서는 fixed가 없어서
                                      // absolute를 주고, 값을 무지막지하게 크게 주면 됨
                                      position: "absolute",
                                      top: -1000,
                                      left: -1000,
                                      width: 3000,
                                      height: 3000,
                                  }
                        }
                    />
                    <View
                        className={twMerge(
                            // top, left, right, bottom은 부모 기준
                            // translate는 내가 기준
                            ["absolute", "top-full", "left-1/2", "-translate-x-1/2", "rounded-xl"],
                            ["mt-2", "z-50", "min-w-[150px]", "shadow-md"],
                            ["bg-background-paper", "border", "border-divider"],
                            dropdownClassName,
                        )}>
                        {typeof children === "function" ? children(close) : children}
                    </View>
                </>
            )}
        </View>
    );
}

export default Dropdown;
