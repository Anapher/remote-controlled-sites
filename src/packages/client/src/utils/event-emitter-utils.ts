export type RequiredEmitter = {
  on(name: string, handler: EventHandler): any;
  off(name: string, handler: EventHandler): any;
};

export type EventHandler = (...args: any[]) => void;
export type EventSubscription = { handler: EventHandler; name: string };

/**
 * Registers a handler that will be invoked when the hub method with the specified method name is invoked.
 * Return a subscription object that can be unregistered later.
 * @param connection the Signalr connection
 * @param name The name of the hub method to define.
 * @param handler The handler that will be raised when the hub method is invoked.
 */
export function subscribeEvent(
  connection: RequiredEmitter,
  name: string,
  handler: EventHandler
): EventSubscription {
  connection.on(name, handler);
  return { name, handler };
}

/**
 * Removes the specified handler for the specified hub method.
 * @param connection the Signalr connection
 * @param subscription the hub subscription to unsubscribe
 */
export function unsubscribeEvent(
  connection: RequiredEmitter,
  { name, handler }: EventSubscription
): void {
  connection.off(name, handler);
}

export function unsubscribeAll(
  connection: RequiredEmitter,
  subscriptions: EventSubscription[]
): void {
  for (const sub of subscriptions) {
    unsubscribeEvent(connection, sub);
  }
}
