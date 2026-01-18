import { ref, onMounted, onUnmounted } from 'vue'

export function useWebSocket(url, options = {}) {
  const socket = ref(null)
  const isConnected = ref(false)
  const error = ref(null)
  const retryCount = ref(0)
  const MAX_RETRIES = options.maxRetries || 5
  const RETRY_DELAY = options.retryDelay || 3000
  const connectionStatus = ref('initial') // 'initial', 'connecting', 'connected', 'disconnected', 'error'
  const lastError = ref(null)

  // Debug logging function
  const debugLog = (type, message, data = null) => {
    const timestamp = new Date().toISOString()
    console.log(`[WebSocket ${type}] ${timestamp} - ${message}`, data)
  }

  const connect = () => {
    if (!url) {
      debugLog('ERROR', 'WebSocket URL is required')
      error.value = 'WebSocket URL is required'
      return
    }

    connectionStatus.value = 'connecting'
    debugLog('INFO', `Attempting to connect to: ${url}`)

    try {
      socket.value = new WebSocket(url)
      
      socket.value.onopen = () => {
        connectionStatus.value = 'connected'
        debugLog('SUCCESS', 'WebSocket connection opened successfully')
        isConnected.value = true
        retryCount.value = 0
        error.value = null
        lastError.value = null
      }

      socket.value.onclose = (event) => {
        connectionStatus.value = 'disconnected'
        debugLog('ERROR', 'WebSocket connection closed', event)
        isConnected.value = false
        error.value = `WebSocket closed: ${event.code} - ${event.reason}`
        lastError.value = {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        }
        retryConnection()
      }

      socket.value.onerror = (err) => {
        connectionStatus.value = 'error'
        debugLog('ERROR', 'WebSocket error', err)
        error.value = `WebSocket error: ${err.message}`
        lastError.value = err
        retryConnection()
      }

      socket.value.onmessage = (event) => {
        debugLog('MESSAGE', 'Received message', event.data)
      }

    } catch (err) {
      connectionStatus.value = 'error'
      debugLog('ERROR', 'Failed to create WebSocket', err)
      error.value = `Failed to create WebSocket: ${err.message}`
      lastError.value = err
      retryConnection()
    }
  }

  const retryConnection = () => {
    if (retryCount.value < MAX_RETRIES) {
      retryCount.value++
      debugLog('INFO', `Retrying connection (${retryCount.value}/${MAX_RETRIES})...`)
      setTimeout(connect, RETRY_DELAY)
    } else {
      connectionStatus.value = 'error'
      debugLog('ERROR', 'Max retry attempts reached')
      error.value = 'Max retry attempts reached'
    }
  }

  const getDebugInfo = () => ({
    isConnected: isConnected.value,
    error: error.value,
    retryCount: retryCount.value,
    url,
    options,
    connectionStatus: connectionStatus.value,
    socketStatus: socket.value ? socket.value.readyState : null,
    lastError: lastError.value
  })

  onMounted(connect)
  onUnmounted(() => {
    if (socket.value) {
      debugLog('INFO', 'Disconnecting WebSocket')
      socket.value.close()
      socket.value = null
      isConnected.value = false
      error.value = null
      connectionStatus.value = 'disconnected'
    }
  })

  return {
    connect,
    disconnect: () => {
      if (socket.value) {
        debugLog('INFO', 'Disconnecting WebSocket')
        socket.value.close()
        socket.value = null
        isConnected.value = false
        error.value = null
        connectionStatus.value = 'disconnected'
      }
    },
    send: (data) => {
      if (!socket.value || !isConnected.value) {
        debugLog('ERROR', 'WebSocket is not connected')
        return false
      }

      try {
        debugLog('MESSAGE', 'Sending message', data)
        socket.value.send(JSON.stringify(data))
        return true
      } catch (err) {
        debugLog('ERROR', 'Failed to send message', err)
        error.value = `Failed to send message: ${err.message}`
        return false
      }
    },
    setupEventListeners: (onMessage) => {
      if (socket.value) {
        socket.value.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            debugLog('MESSAGE', 'Parsed message', data)
            onMessage(data)
          } catch (error) {
            debugLog('ERROR', 'Error parsing message', error)
            error.value = `Error parsing message: ${error.message}`
          }
        }
      }
    },
    isConnected,
    error,
    retryCount,
    getDebugInfo,
    connectionStatus,
    lastError
  }
}

export function subscribeWebSocket(url, onMessage) {
  const socket = ref(null)
  const isConnected = ref(false)

  // Create WebSocket connection
  socket.value = new WebSocket(url)

  // Handle connection open
  socket.value.onopen = () => {
    console.log('WebSocket connected')
    isConnected.value = true
  }

  // Handle incoming messages
  socket.value.onmessage = (event) => {
    console.log('Received message:', event.data)
    try {
      const data = JSON.parse(event.data)
      onMessage(data)
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  }

  // Handle connection close
  socket.value.onclose = () => {
    console.log('WebSocket disconnected')
    isConnected.value = false
  }

  // Handle errors
  socket.value.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  // Return cleanup function
  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
      isConnected.value = false
    }
  }

  return {
    isConnected,
    disconnect
  }
}
