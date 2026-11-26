import { useEffect, useRef } from 'react';
import { CloseIcon } from '../Icons';
import styles from './Modal.module.css';

/** Accessible dialog built on <dialog>: focus trap, Escape and backdrop close come with showModal(). */
const Modal = ({ open, onClose, title, icon, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleClick = (event) => {
    if (event.target === ref.current) onClose();
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={handleClick}
    >
      <div className={styles.content}>
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </button>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
