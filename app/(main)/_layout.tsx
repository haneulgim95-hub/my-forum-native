import { useWindowDimensions, View } from "react-native";
import { Slot } from "expo-router";
import MainFooter from "@/components/layouts/main/MainFooter";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";
import MainHeaderDesktop from "@/components/layouts/main/MainHeaderDesktop";

function MainLayout() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    return (
        <View className={"flex-1"}>
            {isMobile ? <MainHeaderMobile /> : <MainHeaderDesktop />}
            <View className={"flex-1"}>
                <Slot />
            </View>
            <MainFooter />
        </View>
    );
}

export default MainLayout;
