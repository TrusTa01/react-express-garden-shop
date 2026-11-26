// Inline SVG icons (stroke = currentColor), decorative by default.
const Svg = ({ children, size = 24, title, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? 'img' : undefined}
    focusable="false"
    {...rest}
  >
    {title && <title>{title}</title>}
    {children}
  </svg>
);

export const CartIcon = (props) => (
  <Svg {...props}>
    <path d="M3 4h2l2.2 10.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" />
    <circle cx="10" cy="20" r="1.4" />
    <circle cx="17" cy="20" r="1.4" />
  </Svg>
);

export const MenuIcon = (props) => (
  <Svg {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const MinusIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h14" />
  </Svg>
);

export const PlusIcon = (props) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const TrashIcon = (props) => (
  <Svg {...props}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </Svg>
);

export const ChevronRightIcon = (props) => (
  <Svg {...props}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);

export const ChevronLeftIcon = (props) => (
  <Svg {...props}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
);

export const ArrowRightIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const FilterIcon = (props) => (
  <Svg {...props}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Svg>
);

export const TruckIcon = (props) => (
  <Svg {...props}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </Svg>
);

export const ReturnIcon = (props) => (
  <Svg {...props}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
  </Svg>
);

export const SupportIcon = (props) => (
  <Svg {...props}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <path d="M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1z" />
  </Svg>
);

export const CheckIcon = (props) => (
  <Svg {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const AlertIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </Svg>
);

export const PhoneIcon = (props) => (
  <Svg {...props}>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </Svg>
);

export const PinIcon = (props) => (
  <Svg {...props}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Svg>
);

export const ClockIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const WhatsAppIcon = (props) => (
  <Svg {...props}>
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z" />
  </Svg>
);

export const LeafLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <circle cx="16" cy="16" r="16" fill="currentColor" />
    <path d="M16 25v-9" stroke="var(--color-bone)" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M16 17c0-4.4-3-7.4-7.6-7.6.2 4.6 3.2 7.6 7.6 7.6Z" fill="var(--color-bone)" />
    <path d="M16 15.2c0-4 2.7-6.8 6.9-7-.2 4.2-2.9 7-6.9 7Z" fill="var(--color-bone)" />
  </svg>
);
