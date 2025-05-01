import {observer} from "mobx-react-lite";
import icon_arrow from "@images/icon_arrow.svg"
import classes from "./OnBoard.module.css"

export const OnBoard = observer(({onBoardVM}) => {
    return (
        <>
            <div className={classes.onBoard}>
                <div className={classes.rowImage}>
                    <button className={classes.button} onClick={onBoardVM.hdlBack}>
                        <img src={icon_arrow} className={classes.imageInButton} alt="button" style={{transform: 'rotate(180deg)'}} />
                    </button>
                    <img
                        className={classes.imageOnBoard}
                        src={onBoardVM.slides[onBoardVM.currentIndex].imageUrl}
                        alt={onBoardVM.slides[onBoardVM.currentIndex].title}
                    />
                    <button className={classes.button} onClick={onBoardVM.hdlNext}>
                        <img src={icon_arrow} className={classes.imageInButton} alt="button"/>
                    </button>
                </div>
                <h3 className={classes.titleOnBoard}>{onBoardVM.slides[onBoardVM.currentIndex].title}</h3>
                <h4 className={classes.descriptionOnBoard}>{onBoardVM.slides[onBoardVM.currentIndex].description}</h4>
            </div>
        </>
    )
})