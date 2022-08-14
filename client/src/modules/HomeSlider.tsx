import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import "../styles/scss/fonts.scss"
import "../styles/scss/modules/HomeSlider/HomeSlider.scss"
import "../styles/scss/modules/HomeSlider/576.scss"
import "../styles/scss/modules/HomeSlider/768.scss"

import { motion, useAnimation } from "framer-motion"
import { IntervalHistogram } from 'perf_hooks'

const sliderImageVariants = {
    initial: {
        backgroundPosition: "0%"
    },

    animate: {
        backgroundPosition: "80%",
        transition: {
            duration: 8,
            ease: "linear"
        }
    },

    fadeOut: {
        opacity: [0.2, 0, 0],
        backgroundPosition: ["80%", "0%"],
        transition: {
            duration: 1
        }
    },
    fadeIn: {
        opacity: [0.2, 1, 1],
        transition: {
            duration: 1
        }
    }
}

const textVariants = {
    initial: {
        opacity: 0,
        textDecoration: "none",
        height: "0px",
        scale: 1
    },

    animate: {
        opacity: 1,
        height: ["60px", "60px"],
        scale: [1, 1.1, 1],
        transition: {
            ease: "linear",
            duration: .3
        }
    }
}

const underlineVariants = {

}

const sliderTexts = ["Meet new people", "Discover unknown culture", "Behold the beauty of nature", "Pull yourself into the whirl of fun"]

const HomeSlider = () => {
    // const [imageIncrementer, setImageIncrementer] = useState(0)
    const [rerender, setRerender] = useState(false)
    const imageIncrementer = useRef(0)
    const imageTimeoutRef = useRef()
    const imageDivRef = useRef() as MutableRefObject<HTMLDivElement>

    const imageController = useAnimation()
    const textController = useAnimation()

    useEffect(() => {
        imageController.start("animate")

        setTimeout(() => {
            textController.start("animate")
        }, 1000)

        //@ts-ignore
        imageTimeoutRef.current = setInterval(() => {
            imageController.start("fadeOut")
            textController.start("initial")
            if (imageIncrementer.current < 3) {
                imageIncrementer.current++
            } else {
                imageIncrementer.current = 0
            }
            // console.log(imageIncrementer) 
            setRerender(prev => !prev) // force rerendering the image and text
            
            setTimeout(() => {
                imageController.start("fadeIn")
                imageController.start("animate")

                setTimeout(() => {
                    textController.start("animate")
                }, 1000)
            }, 1000)
        }, 8000)



        return () => {
            //@ts-ignore
            clearInterval(imageTimeoutRef.current)
        }
    }, [])

    // console.log(imageIncrementer.current)

  return (
    <div className='slider-container'>
        <div className="slider-text">
            <motion.p variants={textVariants} animate={textController} initial="initial">{sliderTexts[imageIncrementer.current]}</motion.p>
        </div>
        <motion.div className="slider-img" variants={sliderImageVariants} initial="initial" animate={imageController}
        ref={imageDivRef}
        style={{
            backgroundImage: `url("slider${imageIncrementer.current}.jpg")`,
            backgroundSize: "200%",
            backgroundPosition: "-100px 0",
            backgroundRepeat: "no-repeat",
            minHeight: "auto",
            filter: "brightness(70%)"
        }}
        >
            {/* <img src="slider0.jpg" alt="slider" /> */}
        </motion.div>
    </div>
  )
}

export default HomeSlider