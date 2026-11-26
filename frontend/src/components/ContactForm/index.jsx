import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactRules, trimContact } from '../../utils/contactRules';
import Button from '../ui/Button';
import { AlertIcon } from '../Icons';
import styles from './ContactForm.module.css';

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', placeholder: 'Your name' },
  { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', placeholder: '+1 555 123 4567' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'name@example.com' },
];

/**
 * Name / phone / email form with inline validation and a visible server error.
 * `onSubmit(values)` must throw on failure. After success, `renderSuccess(reset)`
 * replaces the form if given; otherwise the form is simply cleared.
 */
const ContactForm = ({ submitLabel, submittingLabel = 'Sending…', submitVariant = 'primary', onSubmit, renderSuccess }) => {
  const id = useId();
  const [serverError, setServerError] = useState(null);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched', defaultValues: { name: '', phone: '', email: '' } });

  const submit = async (values) => {
    setServerError(null);
    try {
      await onSubmit(trimContact(values));
      reset();
      setSent(true);
    } catch (error) {
      setServerError(error.message);
    }
  };

  if (sent && renderSuccess) return renderSuccess(() => setSent(false));

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
      {FIELDS.map((field) => {
        const error = errors[field.name];
        const inputId = `${id}-${field.name}`;
        return (
          <div key={field.name} className={styles.field}>
            <label htmlFor={inputId} className={styles.label}>
              {field.label}
            </label>
            <input
              id={inputId}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              className={`${styles.input} ${error ? styles.invalid : ''}`}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...register(field.name, contactRules[field.name])}
            />
            {error && (
              <p id={`${inputId}-error`} className={styles.error}>
                {error.message}
              </p>
            )}
          </div>
        );
      })}

      {serverError && (
        <div className={styles.serverError} role="alert">
          <AlertIcon size={20} />
          <span>{serverError}</span>
        </div>
      )}

      <Button type="submit" variant={submitVariant} size="lg" block disabled={isSubmitting}>
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
};

export default ContactForm;
