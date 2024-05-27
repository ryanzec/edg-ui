import { type Placement, type OffsetOptions, flip, offset, computePosition } from '@floating-ui/dom';
import { get, writable } from 'svelte/store';

export type TooltipActionOptions = {
  isEnabled?: boolean;
  placement?: Placement;
  offsetOptions?: OffsetOptions;
};

const defaultTooltipActionOptions: TooltipActionOptions = {
  isEnabled: true,
  placement: 'bottom-start',
};

export const createTooltipStore = () => {
  // // we need to track when the tooltip is moved so we know what we need to do to cleanup the tooltop in certain cases
  // const tooltipIsMoved = writable(false);
  const handleElement = writable<HTMLElement | null>(null);
  const contentElement = writable<HTMLElement | null>(null);
  const isEnabled = writable(false);

  const tooltipAction = (element: HTMLElement, overrideOptions: TooltipActionOptions = {}) => {
    const options = {
      ...defaultTooltipActionOptions,
      ...overrideOptions,
    };

    const middleware = [flip()];

    if (options.offsetOptions) {
      middleware.push(offset(options.offsetOptions));
    }

    const setupTooltip = async () => {
      const handle = element.querySelector('[data-tooltip-handle]') as HTMLElement;
      const content = element.querySelector('[data-tooltip-content]') as HTMLElement;

      if (!handle || !content) {
        return;
      }

      handleElement.set(handle);
      contentElement.set(content);

      const originalPointerEvents = content.style.pointerEvents;
      content.style.pointerEvents = 'none';

      // to avoid styling issues, moving to the body
      document.body.appendChild(content);

      isEnabled.set(!!options.isEnabled);

      const updateTooltipPosition = async () => {
        const computedPosition = await computePosition(handle, content, {
          placement: options.placement,
          middleware,
        });

        Object.assign(content.style, {
          left: `${computedPosition.x}px`,
          top: `${computedPosition.y}px`,
        });
      };

      handle.addEventListener('mouseenter', async () => {
        if (get(isEnabled) === false) {
          return;
        }

        content.style.opacity = '1';
        content.style.pointerEvents = originalPointerEvents;

        updateTooltipPosition();
      });

      handle.addEventListener('mouseleave', () => {
        if (get(isEnabled) === false) {
          return;
        }

        content.style.opacity = '0';
        content.style.pointerEvents = 'none';
      });
    };

    setupTooltip();

    return {
      destroy: () => {
        // since the content is move to the body, we need to manually remove it
        const elementToRemvoe = get(contentElement);

        if (elementToRemvoe) {
          document.body.removeChild(elementToRemvoe);
        }
      },
    };
  };

  return {
    tooltipAction,
    isEnabled,
  };
};
