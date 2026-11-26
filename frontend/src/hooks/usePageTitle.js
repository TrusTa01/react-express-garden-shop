import { useEffect } from 'react';

const SITE = 'Garden Shop';

/** Sets document.title as "<page> | Garden Shop". */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE}: plants, tools and garden decor`;
  }, [title]);
}
