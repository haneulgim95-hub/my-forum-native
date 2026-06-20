import { View } from "react-native";
import { Slot } from "expo-router";
import MainHeader from "@/components/layouts/main/MainHeader";
import MainFooter from "@/components/layouts/main/MainFooter";

function MainLayout() {
    return (
        <View className={"flex-1"}>
            <MainHeader/>
            <View className={"flex-1"}>
                <Slot/>
            </View>
            <MainFooter/>
        </View>
    )
}

export default MainLayout;