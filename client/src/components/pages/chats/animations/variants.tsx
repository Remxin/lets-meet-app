import { FaRegIdBadge } from "react-icons/fa"

export const sectionVariants = {
    showContent: {
        height: "fit-content",
    },
    hideContent: {
        height: 30
    }


}

export const titleVariants = {
    clickLight: {
        backgroundColor: "#F0A34B"
    },
    clickDark: {
        backgroundColor: "#F0743D"
    },
    hover: {
        scale: 0.95,
        transition: {
            type: "spring",
            stiffness: 100,
        }
    },
    hold: {
        scale: 0.7,
        radius: 15,
        transition: {
            
            duration: 0.3
        }
    },
}

export const arrowVariants = {
    rotate: {
        rotate: 180
    },
    unrotate: {
        rotate: 0
    }
}