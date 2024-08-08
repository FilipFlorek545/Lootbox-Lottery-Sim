import {productData} from "../data";
import lottery from '../styles/lottery.css'
import {useEffect, useRef, useState} from "react";


// check for malicious dom interactions via counting children?

const Lottery = () => {
    document.addEventListener('keydown', preventKeyBoardScroll);
    const scrollContainerRef = useRef(null)
    const buttonRef = useRef(null)
    const pressInterval = useRef(null)
    const pressTimerRef = useRef(0)
    const [translateX, setTranslateX] = useState(0)
    const [pressTimer, setPressTimer] = useState(0)
    const [oncePressed, setOncePressed] = useState(false)
    const [isPressed, setIsPressed] = useState(false)

    const handleMouseDown = () => {
        setIsPressed(true)
        pressInterval.current = setInterval(() => {
            setPressTimer(prevState => {
                const newState = prevState + 1;
                //500 - 5s, 300 - 3s etc
                if(newState > 500) {
                    handleMouseUp()
                } else if(newState > 300) {
                    setTranslateX(prevState  => prevState -= 50)
                } else if(newState > 150) {
                    setTranslateX(prevState  => prevState -= 25)
                } else {
                    setTranslateX(prevState  => prevState -= 15)
                }
                return newState;
            });
        }, 10);
    }

    useEffect(() => {
        pressTimerRef.current = pressTimer;
    }, [pressTimer]);
    const handleMouseUp = () => {
        clearInterval(pressInterval.current)
        setOncePressed(true)


        let afterRollTimer = pressTimerRef.current > 150 ? pressTimerRef.current : 100
        let force = 0
        pressInterval.current = setInterval(() => {
            setPressTimer(prevState => {
                const newState = prevState + 1;
                if(afterRollTimer > 300) {
                    if(force === 0) force = 50 + Math.random() * (10 - 0.5) + 0.5
                    setTranslateX(prevState  => prevState -= force)
                    force -= 0.1
                    if(force < 0.2){
                        clearInterval(pressInterval.current)
                    }
                } else if(afterRollTimer > 150) {
                    if(force === 0) force = 25;
                    setTranslateX(prevState  => prevState -= force)
                    force -= 0.05
                    if(force < 0.2){
                        clearInterval(pressInterval.current)
                    }
                } else {
                    if(force === 0) force = 15
                    setTranslateX(prevState  => prevState -= force)
                    force -= 0.05
                    if(force < 0.2){
                        clearInterval(pressInterval.current)
                    }
                }
                return newState;
            });
        }, 10);

        setIsPressed(false)
    }
        let press = isPressed || oncePressed
    const listItems = [...productData,...productData,...productData].map((item, index) => {
        return(
            <div key={index} className="loot-box">
                <div className="contents-wrapper">
                    <div className="loot-image-wrapper">
                        <img src={item.image} alt={item.name}/>
                    </div>
                    <div>
                        <p>{item.name}</p>
                    </div>
                    <div>
                        <p className={"loot-price " + item.rarity}>{item.priceDrop} PLN</p>
                    </div>
                </div>
            </div>
        )
        }
    )

    function preventKeyBoardScroll(e) {
        let keys = [32, 33, 34, 35, 37, 38, 39, 40];
        if (keys.includes(e.keyCode)) {
            e.preventDefault();
            return false;
        }
    }
    return (
        <>
            <div className='arrow'></div>
            <div className={"loot-boxes " + (!press ? 'blurred' : '')}
                 ref={scrollContainerRef}
                 style={{transform: `translateX(${translateX}px`}}>
                {listItems}
            </div>
            <button disabled={oncePressed}
                    className="start-lottery"
                    ref={buttonRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                // onTouchStart={handleTouchStart}
                // onTouchEnd={handleTouchEnd}
            >Losuj!
            </button>
        </>
    )
}
export default Lottery;
