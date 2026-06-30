import { useWindowDimensions, View } from "react-native";
import { Slot } from "expo-router";
import MainFooter from "@/components/layouts/main/MainFooter";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";
import MainHeaderDesktop from "@/components/layouts/main/MainHeaderDesktop";
import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import categoryApi from "@/api/user/categoryApi";

function MainLayout() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [list, setList] = useState<Category[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await categoryApi.getCategoryList();
                setList(result);
            } catch (error) {
                console.log(error);
            }
        };
        loadCategories().then(() => {});
    }, []);

    return (
        <View className={"flex-1"}>
            {isMobile ? <MainHeaderMobile list={list}/> : <MainHeaderDesktop list={list}/>}
            <View className={"flex-1"}>
                <Slot />
            </View>
            <MainFooter />
        </View>
    );
}

export default MainLayout;
