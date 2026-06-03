import { afterEach, describe, expect, it } from 'vitest';

import { type BrowserTabMessage, browserTabsManager, TabMessageType } from './browser-tabs-manager';

describe('browserTabsManager', () => {
  describe('sendMessage', () => {
    it('broadcasts the message to other tabs on the shared channel', async () => {
      const message: BrowserTabMessage = { type: TabMessageType.MESSAGE, data: { value: 'sent' } };

      const received = new Promise<BrowserTabMessage>((resolve) => {
        const listener = new BroadcastChannel('tab-channel');

        listener.onmessage = (event: MessageEvent<BrowserTabMessage>) => {
          listener.close();
          resolve(event.data);
        };
      });

      browserTabsManager.sendMessage(message);

      await expect(received).resolves.toEqual(message);
    });
  });

  describe('onMessage', () => {
    it('routes messages received on the shared channel to the assigned handler', async () => {
      const message: BrowserTabMessage = { type: TabMessageType.MESSAGE, data: 42 };

      const received = new Promise<BrowserTabMessage>((resolve) => {
        browserTabsManager.onMessage = resolve;
      });

      const sender = new BroadcastChannel('tab-channel');

      sender.postMessage(message);

      await expect(received).resolves.toEqual(message);

      sender.close();
    });
  });

  afterEach(() => {
    browserTabsManager.onMessage = () => {
      // reset to a no-op so a handler assigned by one test does not leak into another
    };
  });
});
