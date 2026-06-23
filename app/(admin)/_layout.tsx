import { twMerge } from "tailwind-merge";
import { ScrollView, View } from "react-native";
import AdminAsideDesktop from "@/components/layouts/admin/AdminAsideDesktop";
import { Slot } from "expo-router";
import AdminAsideMobile from "@/components/layouts/admin/AdminAsideMobile";

function AdminLayout() {
    return (
        <View className={twMerge("flex-1", "flex-col", "md:flex-row")}>
            {/* hidden -> display: hidden, flex -> display: flex */}
            {/* 화면이 작을 대(기본값)은 hidden이 적용될 것이고, 화면이 768px을 넘어가면 flex로 적용 */}
            <View className={twMerge("hidden", "md:flex", "h-full")}>
                <AdminAsideDesktop />
            </View>

            <View className={twMerge("flex", "md:hidden", "w-full", "z-50")}>
                <AdminAsideMobile />
            </View>

            <View className={"flex-1"}>
                <ScrollView
                    className={"flex-1"}
                    contentContainerClassName={"p-4 md:p-8 items-center"}
                    showsVerticalScrollIndicator={false}>
                    <View className={"w-full max-w-5xl"}>
                        <Slot />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default AdminLayout;
