import React from "react";

class AdminHelpers {
    colorStatus = (status: String) => {
        switch(status) {
            case "Great": 
                return "green"
            case "Normal":
                return "#cccc00"
            case "Bad": 
                return "orange"
            case "Fatal":
                return "red"

            default: 
                return "black"
        }
    }
}

const adminHelper = new AdminHelpers()
export default adminHelper