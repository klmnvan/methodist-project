import {useState} from "react";
import {createPortal} from "react-dom";
import classes from "./ModalPortal.module.css";

function ModalPortal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>Открыть модальное окно</button>

            {isOpen && createPortal(
                <div className={classes.modalOverlay}>
                    <div className={classes.modal}>
                        <h2>Модальное окно</h2>
                        <p>Это модальное окно рендерится через портал</p>
                        <button onClick={() => setIsOpen(false)}>Закрыть</button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}