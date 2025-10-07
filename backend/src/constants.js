// Shared constants

// Canonical order statuses and a fast lookup set
const ORDER_STATUSES = ['received', 'brewing', 'ready', 'paid', 'completed']
const ORDER_STATUS_SET = new Set(ORDER_STATUSES)

module.exports = {
  ORDER_STATUSES,
  ORDER_STATUS_SET,
}
