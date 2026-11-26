// react-hook-form rules that mirror the backend contact schema (backend/src/modules/orders/orders.schema.js).
export const contactRules = {
  name: {
    required: 'Please enter your name',
    maxLength: { value: 100, message: 'Name must be 100 characters or fewer' },
    validate: (value) => value.trim().length > 0 || 'Please enter your name',
  },
  phone: {
    required: 'Please enter your phone number',
    validate: (value) => {
      const phone = value.trim();
      if (phone.length < 5) return 'Phone number is too short';
      if (phone.length > 30) return 'Phone number is too long';
      if (!/^[+\d\s().-]+$/.test(phone)) return 'Use digits, spaces and + ( ) - only';
      return true;
    },
  },
  email: {
    required: 'Please enter your email',
    maxLength: { value: 254, message: 'Email is too long' },
    validate: (value) => /^[^\s@]+@[^\s@]+$/.test(value.trim()) || 'Enter a valid email, e.g. name@example.com',
  },
};

export const trimContact = ({ name, phone, email }) => ({
  name: name.trim(),
  phone: phone.trim(),
  email: email.trim(),
});
