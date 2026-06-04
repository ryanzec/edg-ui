/** the single broadcast channel name shared across all browser tabs */
export const BROWSER_TAB_CHANNEL_NAME = 'tab-channel';

/** the kinds of messages that can be broadcast between browser tabs */
export const TabMessageType = {
  MESSAGE: 'message',
} as const;

export type TabMessageType = (typeof TabMessageType)[keyof typeof TabMessageType];

/** structured payload broadcast across browser tabs */
export type BrowserTabMessage = {
  type: TabMessageType;
  data: unknown;
};

class BrowserTabsManager {
  /** the single broadcast channel used to communicate between browser tabs */
  private _channel = new BroadcastChannel(BROWSER_TAB_CHANNEL_NAME);

  constructor() {
    this._channel.onmessage = (event: MessageEvent<BrowserTabMessage>) => {
      this.onMessage(event.data);
    };
  }

  /** handler invoked when a message is received on the tab channel */
  public onMessage: (message: BrowserTabMessage) => void = () => {
    // intentionally empty, designed to be assigned by consumers to react to broadcast messages
  };

  /** broadcasts a structured message to all other browser tabs on the shared channel */
  public sendMessage(message: BrowserTabMessage): void {
    this._channel.postMessage(message);
  }
}

export const browserTabsManager = new BrowserTabsManager();
