import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import PlayButton from './PlayButton'
import PauseButton from './PauseButton'
import SettingsButton from './SettingsButton'
import { useContext, useState, useEffect, useRef } from 'react'
import SettingsContext from './SettingsContext'
import styles from './Timer.module.css'
import ButtonStyles from './Buttons.module.css'

const purple = '#543786';
const orange = '#FE8737';

function Timer() {

    const settingsInfo = useContext(SettingsContext);

    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work'); // work, break, null
    const [secondsLeft, setSecondsLeft] = useState(0);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
      }
    
      useEffect(() => {
    
    function switchMode() {
        const nextMode = modeRef.current === 'work' ? 'break' : 'work';
        const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

        setMode(nextMode);
        modeRef.current = nextMode;

        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;
    }

    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
        if (isPausedRef.current) {
            return;
        }
        if (secondsLeftRef.current === 0) {
            isPausedRef.current = true;
            setIsPaused(true);
            return switchMode();
        }
        tick();
    },1000);
    
    return () => clearInterval(interval);
    }, [settingsInfo]);

    function getDate() {
        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth();
        const monthNames = ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'];
        return `${date + " "  + monthNames[month]}`;
    }
    
    const [currentDate, setCurrentDate] = useState(getDate());
    
    const totalSeconds = mode === 'work'
        ? settingsInfo.workMinutes * 60
        : settingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeft / totalSeconds * 100);
    
    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;
    if(seconds < 10) seconds = '0'+seconds;

    return (
        <div className={styles.timer}>
            <div className={styles.currentDate}>{currentDate}</div>
            <CircularProgressbar
                className={styles.CircularProgressbar}
                value={percentage}
                text={minutes + ':' + seconds} 
                strokeWidth={2}
                ballStrokeWidth
                styles={buildStyles({
                textColor: "#543786",
                pathColor: mode === 'work' ? purple : orange
            })} />
            <div className={ButtonStyles.timerButton}>
                {isPaused 
                ? <PlayButton onClick={() => {setIsPaused(false); isPausedRef.current = false}} /> 
                : <PauseButton onClick={() => {setIsPaused(true); isPausedRef.current = true}} /> }
                <SettingsButton onClick={() => settingsInfo.setShowSettings(true)}/>
            </div>
            <div className={styles.bgLayers}>
                <div></div><div></div><div></div><div></div>
            </div>
        </div>
    )
}

export default Timer