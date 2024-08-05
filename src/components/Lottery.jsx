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
    const [pressTimer, setPressTimer] = useState(0)
    const [oncePressed, setOncePressed] = useState(false)
    const [isPressed, setIsPressed] = useState(false)

    const handleMouseDown = () => {
        console.log('mouse down!')
        setIsPressed(true)
        pressInterval.current = setInterval(() => {
            setPressTimer(prevState => {
                const newState = prevState + 1;
                //500 - 5s, 300 - 3s etc
                if(newState > 500) {
                    handleMouseUp()
                } else if(newState > 300) {
                    scrollContainerRef.current.scrollLeft += 17
                } else if(newState > 150) {
                    scrollContainerRef.current.scrollLeft += 10;
                } else {
                    scrollContainerRef.current.scrollLeft += 5;
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
                    if(force === 0) force = 17 + Math.random() * (3 - 0.5) + 0.5
                    scrollContainerRef.current.scrollLeft += force
                    force -= 0.03
                    if(force < 0.8){
                        clearInterval(pressInterval.current)
                    }
                } else if(afterRollTimer > 150) {
                    if(force === 0) force = 10;
                    scrollContainerRef.current.scrollLeft += force;
                    force -= 0.02
                    if(force < 0.6){
                        clearInterval(pressInterval.current)
                    }
                } else {
                    if(force === 0) force = 7
                    scrollContainerRef.current.scrollLeft += force;
                    force -= 0.02
                    if(force < 0.4){
                        clearInterval(pressInterval.current)
                    }
                }
                return newState;
            });
        }, 10);

        setIsPressed(false)
    }

    const listItems = productData.map((item, index) => {
        return(
        <div key={index} className="loot-box">
            <a href={item.href} target="_top">
                <div>
                    <img src={item.image} alt={item.name}/>
                </div>
                <div>
                    <p>{item.name}</p>
                </div>
                <div>
                    <p>{item.priceDrop}</p>
                </div>
            </a>
        </div>
        )}
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
            <div className="loot-boxes" ref={scrollContainerRef}>
                {listItems}
            </div>
            <button disabled={oncePressed}
                    className="start-lottery"
                    ref={buttonRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                // onTouchStart={handleTouchStart}
                // onTouchEnd={handleTouchEnd}
            >Go!
            </button>
        </>
    )
}
export default Lottery;


// if(isPressed > 100){
//     clearInterval(pressInterval.current)
//     pressInterval.current = setInterval(() => {
//         console.log(123)
//         setIsPressed(prevState => prevState + 1)
//         scrollContainerRef.current.scrollBy(300, 0)
//     },10)
// }

// const time = Date.now()
// setTimer(time)
// setIsPressed(true)