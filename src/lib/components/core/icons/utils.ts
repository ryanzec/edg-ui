import AlignJustifiedIcon from '$lib/components/core/icons/icons/align-justified.svg?raw';
import CheckIcon from '$lib/components/core/icons/icons/check.svg?raw';
import ChevronDownIcon from '$lib/components/core/icons/icons/chevron-down.svg?raw';
import ChevronLeftIcon from '$lib/components/core/icons/icons/chevron-left.svg?raw';
import ChevronRightIcon from '$lib/components/core/icons/icons/chevron-right.svg?raw';
import ChevronUpIcon from '$lib/components/core/icons/icons/chevron-up.svg?raw';
import SelectorIcon from '$lib/components/core/icons/icons/selector.svg?raw';
import CircleCheckIcon from '$lib/components/core/icons/icons/circle-check.svg?raw';
import CircleDotIcon from '$lib/components/core/icons/icons/circle-dot.svg?raw';
import CircleIcon from '$lib/components/core/icons/icons/circle.svg?raw';
import LoaderIcon from '$lib/components/core/icons/icons/loader.svg?raw';
import PlusIcon from '$lib/components/core/icons/icons/plus.svg?raw';
import SquareCheckIcon from '$lib/components/core/icons/icons/square-check.svg?raw';
import SquareIcon from '$lib/components/core/icons/icons/square.svg?raw';
import SquareMinusIcon from '$lib/components/core/icons/icons/square-minus.svg?raw';
import XIcon from '$lib/components/core/icons/icons/x.svg?raw';

// this is not typed as we want to have the types be dynamically generated so by doing this we can add to the object
// and the IconName type will be updated automatically and also make sure the values passed in here are of type
// Component since what we export is properly typed
const internalIconComponents = {
  'align-justified': AlignJustifiedIcon,
  check: CheckIcon,
  'chevron-down': ChevronDownIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-up': ChevronUpIcon,
  selector: SelectorIcon,
  'circle-check': CircleCheckIcon,
  'circle-dot': CircleDotIcon,
  circle: CircleIcon,
  loader: LoaderIcon,
  plus: PlusIcon,
  'square-check': SquareCheckIcon,
  square: SquareIcon,
  'square-minus': SquareMinusIcon,
  x: XIcon,
};

export type IconName = keyof typeof internalIconComponents;
export const iconComponents: Record<IconName, string> = internalIconComponents;
