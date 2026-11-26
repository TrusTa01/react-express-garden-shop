import styles from './Button.module.css';

/**
 * Shared button. `as` renders it as another element (e.g. react-router Link)
 * so links and buttons look identical.
 */
const Button = ({ as: Component = 'button', variant = 'primary', size = 'md', block = false, className = '', ...rest }) => {
  const classes = [styles.button, styles[variant], styles[size], block ? styles.block : '', className]
    .filter(Boolean)
    .join(' ');
  const extra = Component === 'button' && !rest.type ? { type: 'button' } : {};
  return <Component className={classes} {...extra} {...rest} />;
};

export default Button;
