import styles from './Modal.module.css'
import {useEffect} from "react";

function Modal({ active, setActive, children }) {

    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            setActive(false); // закрываем модальное окно
        }
    }

    useEffect(() => {
        // добавляем обработчик события при монтировании
        if (active) {
            window.addEventListener('keydown', handleEscape)
        }
        // удаляем обработчик события при размонтировании или закрытии модального окна
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [active]);

    useEffect(() => {
        const topOffset = window.scrollY
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (active) {
            document.body.style.position = 'fixed';
            document.body.style.top = `-${topOffset}px`;
            document.body.style.width = '100%';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            return;
        }
        // удаляем изменение при размонтировании компонента
        return () => {
            //  заменить на удаление стилей, когда будет такая необходимость
            document.body.removeAttribute('style');
            window.scrollTo(0, topOffset);
        };
    }, [active]);

    return (
        // чтобы окно не висел в DOM
        // active && (
        //     ...
        // )

        <div className={active ? `${styles.modal} ${styles.active}` : styles.modal} onClick={() => setActive(false)}>
            <div className={active ? `${styles.modal_content} ${styles.active}` : styles.modal_content}
                 onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal
