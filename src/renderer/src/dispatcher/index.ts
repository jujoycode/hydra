type Callback = (...args: any[]) => void

/**
 * Dispatcher
 * @desc Event Dispatcher
 */
export class Dispatcher {
  private callbacks: Map<string, Callback>
  private isDispatching: boolean

  constructor() {
    this.callbacks = new Map()
    this.isDispatching = false
  }

  /**
   * Register a callback for an event
   * @param id - Event ID
   * @param callback - Callback function
   */
  register(id: string, callback: Callback): void {
    if (this.callbacks.has(id)) {
      throw new Error(`Callback with id ${id} is already registered.`)
    }

    this.callbacks.set(id, callback)
  }

  /**
   * Unregister a callback for an event
   * @param id - Event ID
   */
  unregister(id: string): void {
    this.callbacks.delete(id)
  }

  /**
   * Dispatch an event
   * @param payload - Event payload
   */
  dispatch(payload: any): void {
    if (this.isDispatching) {
      throw new Error('Cannot dispatch while dispatching.')
    }

    this.isDispatching = true

    try {
      this.callbacks.forEach((callback) => callback(payload))
    } finally {
      this.isDispatching = false
    }
  }

  /**
   * Check if a callback is registered for an event
   * @param id - Event ID
   * @returns boolean
   */
  hasCallback(id: string): boolean {
    return this.callbacks.has(id)
  }

  /**
   * Check if the dispatcher is currently dispatching
   * @returns boolean
   */
  getDispatchState(): boolean {
    return this.isDispatching
  }
}
