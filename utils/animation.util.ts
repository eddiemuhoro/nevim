import { LayoutAnimation } from "react-native";

export const animateLayout = (config = {}) => {
    LayoutAnimation.configureNext({
        duration: 300,
        create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
        },
        update: {
            type: LayoutAnimation.Types.easeInEaseOut,
            springDamping: 0.7,
        },
        delete: {
            type: LayoutAnimation.Types.easeOut,
            property: LayoutAnimation.Properties.opacity,
        },
        ...config,
    });
};

