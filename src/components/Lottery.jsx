import {productData} from "../data";
import lottery from '../styles/lottery.css'
import React, {useEffect, useRef, useState} from "react";
import {usePrizeDebounce} from "../usePrizeDebounce";


// check for malicious dom interactions via counting children?

const Lottery = () => {
    document.addEventListener('keydown', preventKeyBoardScroll);
    const scrollContainerRef = useRef(null)
    const buttonRef = useRef(null)
    const pressInterval = useRef(null)
    const pressTimerRef = useRef(0)
    const [windowWidth, setWindowWidth] = useState(0)
    const [translateX, setTranslateX] = useState(0)
    const [pressTimer, setPressTimer] = useState(0)
    const [oncePressed, setOncePressed] = useState(false)
    const [isPressed, setIsPressed] = useState(false)
    const [offSet, setOffSet] = useState(0)
    const [gameOn, setGameOn] = useState(false)

    //px values - how much px will be scrolled based on force
    const forcePxData = [2242.2, 6237.2, 15599.9];



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

    useEffect(() => {
        setWindowWidth(window.innerWidth)
    }, [windowWidth])

    const handleMouseUp = () => {
        insertWinningBox()
        clearInterval(pressInterval.current)
        setOncePressed(true)
        let afterRollTimer = pressTimerRef.current > 150 ? pressTimerRef.current : 100
        let force = 0

        const handleForce = (forceMax, forceDeplete) => {
            if(force === 0) force = forceMax;
            setTranslateX(prevState  => prevState -= force)
            force -= forceDeplete
            if(force < 0.2){
                clearInterval(pressInterval.current)
            }
        }

        pressInterval.current = setInterval(() => {
            setPressTimer(prevState => {
                const newState = prevState + 1;
                if(afterRollTimer > 300) {
                  handleForce(50, 0.08)
                } else if(afterRollTimer > 150) {
                   handleForce(25, 0.05)
                } else {
                   handleForce(15, 0.05)
                }
                return newState;
            });
        }, 10);

        setIsPressed(false)
    }

        let press = isPressed || oncePressed
    let listItemsFull = [...productData, ...productData, ...productData]
    const listItems = listItemsFull.map((item, index) => {
        return(
            <div key={index} className="loot-box">
                <div className="contents-wrapper">
                    <div className="loot-image-wrapper">
                        <img src={item.image} alt={item.name}/>
                    </div>
                    <div>
                        <p>{item.name + ' ' + index}</p>
                    </div>
                    <div>
                        <p className={"loot-price " + item.rarity}>{item.priceDrop} PLN</p>
                    </div>
                </div>
            </div>
        )
        }
    )

    let x = `<div class="contents-wrapper">
        <div class="loot-image-wrapper">
                        <img src="http://localhost:3000/assets/prizes/Bike1.jpg" alt="Bike"/>
                    </div>
                    <div>
                        <p>Winning product!</p>
                    </div>
                    <div>
                        <p class="loot-price purple">-999 PLN</p>
                    </div>
                </div>`




    const insertWinningBox = () => {
        let holdX = translateX === 0 ? 16000 : -translateX
        let releaseX = () => {
            if (holdX > 6000) return 2
            else if (holdX > 2250) return 1
            else return 0
        }
        let calculatedValue = (-holdX - forcePxData[releaseX()] - windowWidth / 2) / 255;
        let winBox = calculatedValue.toFixed(2);
        let winBoxShortened = Math.trunc(calculatedValue)
        let xPos = winBoxShortened * -1
        let winningLootbox = document.createElement('div')
        winningLootbox.innerHTML = x;
        winningLootbox.className = 'loot-box'
        scrollContainerRef.current.insertBefore(winningLootbox, scrollContainerRef.current.children[xPos])
        let calc = (winBox - winBoxShortened).toFixed(2) * -1
        calc = +(calc - 0.5).toFixed(2)

        setOffSet(calc)
    }

    const debouncedTranslateX = usePrizeDebounce(translateX, 500)
    useEffect(() => {
        if(press && offSet !== 0) {
            scrollContainerRef.current.style.transition = "0.2s"
            setTranslateX(prevState => prevState + (offSet * 250))
            setOffSet(0)
            setTimeout(() => {
                setGameOn(true)
            }, 700)
        }
    },[debouncedTranslateX])



    function preventKeyBoardScroll(e) {
        let keys = [32, 33, 34, 35, 37, 38, 39, 40];
        if (keys.includes(e.keyCode)) {
            e.preventDefault();
            return false;
        }
    }
    return (
        <div className="lottery-wrapper">
            {!gameOn && (
            <div style={{left: (windowWidth - 40) / 2}} className='arrow'></div>
                )}
            {!gameOn && (
            <div className={"loot-boxes " + (!press ? 'blurred' : '')}
                 ref={scrollContainerRef}
                 style={{transform: `translateX(${translateX}px`}}>
                {listItems}
            </div>)}
            {!gameOn && (
            <button disabled={oncePressed}
                    className="start-lottery"
                    ref={buttonRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                // onTouchStart={handleTouchStart}
                // onTouchEnd={handleTouchEnd}
            >Losuj!
            </button>)}
            {gameOn && (
            <div className="boxScreen loot-box">
                <div className="contents-wrapper">
                    <div className="loot-image-wrapper">
                        <img src="http://localhost:3000/assets/prizes/Bike1.jpg" alt="Bike"/>
                    </div>
                    <div>
                        <p>Winning product!</p>
                    </div>
                    <div>
                        <p className="loot-price purple">-999 PLN</p>
                    </div>
                </div>
            </div>)}
        </div>
    )
}
export default Lottery;
