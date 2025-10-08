// Simple Server-Sent Events (SSE) pub/sub for order updates

const channels = new Map() // orderId -> Set<res>

function getChannel(id) {
  if (!channels.has(id)) channels.set(id, new Set())
  return channels.get(id)
}

exports.subscribe = function subscribe(orderId, res) {
  const ch = getChannel(orderId)
  ch.add(res)
  // Send initial comment to keep connection
  res.write(`: connected\n\n`)
  // Heartbeat every 20s
  const hb = setInterval(() => {
    try { res.write(`: hb\n\n`) } catch {}
  }, 20000)
  res.on('close', () => {
    clearInterval(hb)
    ch.delete(res)
  })
}

// Subscribe to a global stream of all order events
exports.subscribeAll = function subscribeAll(res) {
  const ch = getChannel('*')
  ch.add(res)
  res.write(`: connected\n\n`)
  const hb = setInterval(() => {
    try { res.write(`: hb\n\n`) } catch {}
  }, 20000)
  res.on('close', () => {
    clearInterval(hb)
    ch.delete(res)
  })
}

exports.publish = function publish(orderId, event, data) {
  const ch = channels.get(orderId)
  if (!ch || ch.size === 0) return
  const payload = `event: ${event}\ndata: ${JSON.stringify(data || {})}\n\n`
  for (const res of ch) {
    try { res.write(payload) } catch {}
  }
  // Also broadcast to the global channel with order context
  const all = channels.get('*')
  if (all && all.size > 0) {
    const globalPayload = `event: order\ndata: ${JSON.stringify({ id: orderId, event, ...(data || {}) })}\n\n`
    for (const res of all) {
      try { res.write(globalPayload) } catch {}
    }
  }
}
