/** Set once the visitor navigates client-side, so the first page load never fades in from 0. */
let navigated = false;
export const markNavigated = () => {
  navigated = true;
};
export const hasNavigated = () => navigated;
