export const PROP_DRILL_CONTEXT_KEY = 'prop-drill';

export type PropDrillContext = {
  value: string;
  callback: () => void;
};
