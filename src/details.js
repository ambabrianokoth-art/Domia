/**
 * Domia Ventures LTD - Property Management System
 * Generic Detail Offcanvas - slides from the right
 *
 * Usage:  DomiaApp.openDetailOffcanvas('staff-attendance', { name: '...', ... })
 *
 * Each page type has a config in DETAIL_CONFIGS that defines:
 *   title: function(data) -> string
 *   icon: bootstrap-icons class string
 *   sections: array of { title, icon, fields: [{label, key, full}] }
 *   status: optional function(data) -> { text, class }
 *   actions: optional array of { label, icon, class }
 */

// ============================================
// Detail field formatters
// ============================================
function fmt(v) {
  if (v === undefined || v === null || v === '') return '—';
  return String(v);
}

function fmtMoney(v) {
  if (v === undefined || v === null || v === '') return '—';
  const n = Number(String(v).replace(/[^0-9.-]/g, ''));
  if (isNaN(n)) return String(v);
  return 'KSh ' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function fmtDate(v) {
  if (!v) return '—';
  return String(v);
}

// ============================================
// Status badge classes
// ============================================
function statusBadge(text, cls) {
  return `<span class="offcanvas-status" style="background: var(--${cls}-bg, var(--bg-tertiary)); color: var(--${cls}, var(--text-primary));">${text}</span>`;
}

// ============================================
// Detail Configurations per page type
// ============================================
const DETAIL_CONFIGS = {
  // --- Core entity details (tenants, maintainers, agreements) ---
  'tenant': {
    title: d => d.name || d.tenant || 'Tenant Details',
    icon: 'bi-person-badge',
    sections: [
      { title: 'Personal Information', icon: 'bi-person', fields: [
        { label: 'Full Name', key: 'name' },
        { label: 'Tenant ID', key: 'id' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'ID Number', key: 'idNumber' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Tenancy Information', icon: 'bi-house-door', fields: [
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Lease Start', key: 'leaseStart' },
        { label: 'Lease End', key: 'leaseEnd' },
        { label: 'Monthly Rent', key: 'rent', format: fmtMoney },
        { label: 'Deposit', key: 'deposit', format: fmtMoney },
      ]},
      { title: 'Additional Information', icon: 'bi-info-circle', fields: [
        { label: 'Address', key: 'address', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'maintainer': {
    title: d => d.name || 'Maintainer Details',
    icon: 'bi-wrench-adjustable',
    sections: [
      { title: 'Personal Information', icon: 'bi-person', fields: [
        { label: 'Full Name', key: 'name' },
        { label: 'Maintainer ID', key: 'id' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Specialization', key: 'specialization' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Work Information', icon: 'bi-briefcase', fields: [
        { label: 'Assigned Properties', key: 'properties' },
        { label: 'Active Tasks', key: 'activeTasks' },
        { label: 'Completed Tasks', key: 'completedTasks' },
        { label: 'Rating', key: 'rating' },
      ]},
      { title: 'Additional Information', icon: 'bi-info-circle', fields: [
        { label: 'Address', key: 'address', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'agreement': {
    title: d => d.id || d.tenant || 'Agreement Details',
    icon: 'bi-file-earmark-check',
    sections: [
      { title: 'Agreement Information', icon: 'bi-file-text', fields: [
        { label: 'Agreement ID', key: 'id' },
        { label: 'Tenant', key: 'tenant' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Agreement Type', key: 'type' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Lease Terms', icon: 'bi-calendar-check', fields: [
        { label: 'Start Date', key: 'startDate' },
        { label: 'End Date', key: 'endDate' },
        { label: 'Monthly Rent', key: 'rent', format: fmtMoney },
        { label: 'Deposit', key: 'deposit', format: fmtMoney },
        { label: 'Payment Frequency', key: 'frequency' },
      ]},
      { title: 'Additional Information', icon: 'bi-info-circle', fields: [
        { label: 'Terms & Conditions', key: 'terms', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'invoice': {
    title: d => d.id || 'Invoice Details',
    icon: 'bi-receipt',
    sections: [
      { title: 'Invoice Information', icon: 'bi-file-text', fields: [
        { label: 'Invoice #', key: 'id' },
        { label: 'Tenant', key: 'tenant' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Issue Date', key: 'issueDate' },
        { label: 'Due Date', key: 'dueDate' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Payment Details', icon: 'bi-cash', fields: [
        { label: 'Amount', key: 'amount', format: fmtMoney },
        { label: 'Tax', key: 'tax', format: fmtMoney },
        { label: 'Total', key: 'total', format: fmtMoney },
        { label: 'Amount Paid', key: 'paid', format: fmtMoney },
        { label: 'Balance', key: 'balance', format: fmtMoney },
      ]},
      { title: 'Additional Information', icon: 'bi-info-circle', fields: [
        { label: 'Description', key: 'description', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'expense': {
    title: d => d.id || d.description || 'Expense Details',
    icon: 'bi-cash-coin',
    sections: [
      { title: 'Expense Information', icon: 'bi-file-text', fields: [
        { label: 'Expense #', key: 'id' },
        { label: 'Description', key: 'description' },
        { label: 'Category', key: 'category' },
        { label: 'Property', key: 'property' },
        { label: 'Date', key: 'date' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Payment Details', icon: 'bi-cash', fields: [
        { label: 'Amount', key: 'amount', format: fmtMoney },
        { label: 'Payment Method', key: 'method' },
        { label: 'Vendor', key: 'vendor' },
        { label: 'Reference', key: 'reference' },
      ]},
      { title: 'Additional Information', icon: 'bi-info-circle', fields: [
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'maintenance': {
    title: d => d.id || d.title || 'Maintenance Request',
    icon: 'bi-tools',
    sections: [
      { title: 'Request Information', icon: 'bi-clipboard', fields: [
        { label: 'Request #', key: 'id' },
        { label: 'Title', key: 'title' },
        { label: 'Tenant', key: 'tenant' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Category', key: 'category' },
        { label: 'Priority', key: 'priority' },
        { label: 'Date', key: 'date' },
        { label: 'Assigned To', key: 'assignedTo' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Request Details', icon: 'bi-file-text', fields: [
        { label: 'Description', key: 'description', full: true },
        { label: 'Resolution', key: 'resolution', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'overdue-rent': {
    title: d => d.tenant || 'Overdue Rent Details',
    icon: 'bi-exclamation-circle',
    sections: [
      { title: 'Tenant Information', icon: 'bi-person', fields: [
        { label: 'Tenant', key: 'tenant' },
        { label: 'Tenant ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
      ]},
      { title: 'Overdue Details', icon: 'bi-cash-stack', fields: [
        { label: 'Amount Overdue', key: 'amount', format: fmtMoney },
        { label: 'Months Overdue', key: 'months' },
        { label: 'Due Date', key: 'dueDate' },
        { label: 'Last Payment', key: 'lastPayment', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Action History', icon: 'bi-clock-history', fields: [
        { label: 'Notices Sent', key: 'notices' },
        { label: 'Last Notice Date', key: 'lastNotice' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'calendar': {
    title: d => d.title || 'Event Details',
    icon: 'bi-calendar-event',
    sections: [
      { title: 'Event Information', icon: 'bi-calendar', fields: [
        { label: 'Title', key: 'title' },
        { label: 'Event ID', key: 'id' },
        { label: 'Type', key: 'type' },
        { label: 'Date', key: 'date' },
        { label: 'Time', key: 'time' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Event Details', icon: 'bi-info-circle', fields: [
        { label: 'Property', key: 'property' },
        { label: 'Tenant', key: 'tenant' },
        { label: 'Location', key: 'location' },
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'contact-diary': {
    title: d => d.name || 'Contact Details',
    icon: 'bi-journal-text',
    sections: [
      { title: 'Contact Information', icon: 'bi-person', fields: [
        { label: 'Name', key: 'name' },
        { label: 'Contact ID', key: 'id' },
        { label: 'Phone', key: 'phone' },
        { label: 'Email', key: 'email' },
        { label: 'Category', key: 'category' },
        { label: 'Date', key: 'date' },
      ]},
      { title: 'Contact Details', icon: 'bi-info-circle', fields: [
        { label: 'Subject', key: 'subject' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
  },
  'notice-board': {
    title: d => d.title || 'Notice Details',
    icon: 'bi-megaphone',
    sections: [
      { title: 'Notice Information', icon: 'bi-info-circle', fields: [
        { label: 'Title', key: 'title' },
        { label: 'Notice ID', key: 'id' },
        { label: 'Posted By', key: 'postedBy' },
        { label: 'Date', key: 'date' },
        { label: 'Audience', key: 'audience' },
        { label: 'Priority', key: 'priority' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Notice Content', icon: 'bi-file-text', fields: [
        { label: 'Content', key: 'content', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'bnb-booking': {
    title: d => d.guest || 'Booking Details',
    icon: 'bi-calendar-check',
    sections: [
      { title: 'Booking Information', icon: 'bi-clipboard', fields: [
        { label: 'Booking #', key: 'id' },
        { label: 'Guest', key: 'guest' },
        { label: 'Property', key: 'property' },
        { label: 'Check-in', key: 'checkIn' },
        { label: 'Check-out', key: 'checkOut' },
        { label: 'Nights', key: 'nights' },
        { label: 'Guests', key: 'guests' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Payment Details', icon: 'bi-cash', fields: [
        { label: 'Total Amount', key: 'amount', format: fmtMoney },
        { label: 'Nightly Rate', key: 'rate', format: fmtMoney },
        { label: 'Cleaning Fee', key: 'cleaningFee', format: fmtMoney },
        { label: 'Payment Method', key: 'method' },
      ]},
      { title: 'Additional Information', icon: 'bi-info-circle', fields: [
        { label: 'Special Requests', key: 'requests', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'bnb-guest': {
    title: d => d.name || 'Guest Details',
    icon: 'bi-person-badge',
    sections: [
      { title: 'Guest Information', icon: 'bi-person', fields: [
        { label: 'Name', key: 'name' },
        { label: 'Guest ID', key: 'id' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Country', key: 'country' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Booking History', icon: 'bi-clock-history', fields: [
        { label: 'Total Bookings', key: 'totalBookings' },
        { label: 'Total Spent', key: 'totalSpent', format: fmtMoney },
        { label: 'Last Booking', key: 'lastBooking' },
        { label: 'Rating', key: 'rating' },
      ]},
      { title: 'Additional Information', icon: 'bi-info-circle', fields: [
        { label: 'Address', key: 'address', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'sales-lead': {
    title: d => d.name || 'Lead Details',
    icon: 'bi-funnel',
    sections: [
      { title: 'Lead Information', icon: 'bi-person', fields: [
        { label: 'Name', key: 'name' },
        { label: 'Lead ID', key: 'id' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Source', key: 'source' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Lead Details', icon: 'bi-info-circle', fields: [
        { label: 'Interest', key: 'interest' },
        { label: 'Budget', key: 'budget', format: fmtMoney },
        { label: 'Assigned To', key: 'assignedTo' },
        { label: 'Date', key: 'date' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'sales-pipeline': {
    title: d => d.name || 'Pipeline Deal',
    icon: 'bi-diagram-3',
    sections: [
      { title: 'Deal Information', icon: 'bi-briefcase', fields: [
        { label: 'Deal Name', key: 'name' },
        { label: 'Deal ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Value', key: 'value', format: fmtMoney },
        { label: 'Stage', key: 'stage' },
        { label: 'Probability', key: 'probability' },
        { label: 'Expected Close', key: 'expectedClose' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Deal Notes', icon: 'bi-sticky', fields: [
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.stage ? statusBadge(d.stage, statusClass(d.stage)) : null,
  },
  'sales-commission': {
    title: d => d.agent || 'Commission Details',
    icon: 'bi-cash-coin',
    sections: [
      { title: 'Commission Information', icon: 'bi-cash', fields: [
        { label: 'Commission ID', key: 'id' },
        { label: 'Agent', key: 'agent' },
        { label: 'Sale', key: 'sale' },
        { label: 'Sale Amount', key: 'saleAmount', format: fmtMoney },
        { label: 'Commission Rate', key: 'rate' },
        { label: 'Commission Amount', key: 'amount', format: fmtMoney },
        { label: 'Date', key: 'date' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Additional Info', icon: 'bi-info-circle', fields: [
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'construction-project': {
    title: d => d.name || d.project || 'Construction Project',
    icon: 'bi-building',
    sections: [
      { title: 'Project Information', icon: 'bi-clipboard', fields: [
        { label: 'Project Name', key: 'name' },
        { label: 'Project ID', key: 'id' },
        { label: 'Location', key: 'location' },
        { label: 'Type', key: 'type' },
        { label: 'Start Date', key: 'startDate' },
        { label: 'End Date', key: 'endDate' },
        { label: 'Budget', key: 'budget', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Project Details', icon: 'bi-info-circle', fields: [
        { label: 'Progress', key: 'progress' },
        { label: 'Contractor', key: 'contractor' },
        { label: 'Description', key: 'description', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'construction-contractor': {
    title: d => d.name || 'Contractor',
    icon: 'bi-person-badge',
    sections: [
      { title: 'Contractor Information', icon: 'bi-building', fields: [
        { label: 'Contractor Name', key: 'name' },
        { label: 'Contractor ID', key: 'id' },
        { label: 'Company', key: 'company' },
        { label: 'Specialization', key: 'specialization' },
        { label: 'Phone', key: 'phone' },
        { label: 'Email', key: 'email' },
        { label: 'Rating', key: 'rating' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Performance', icon: 'bi-graph-up', fields: [
        { label: 'Active Projects', key: 'activeProjects' },
        { label: 'Completed Projects', key: 'completedProjects' },
        { label: 'Total Value', key: 'totalValue', format: fmtMoney },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- Staff / HR ---
  'staff-attendance': {
    title: d => d.name || 'Staff Attendance',
    icon: 'bi-calendar-check',
    sections: [
      { title: 'Employee Information', icon: 'bi-person', fields: [
        { label: 'Employee Name', key: 'name' },
        { label: 'Employee ID', key: 'id' },
        { label: 'Department', key: 'department' },
        { label: 'Position', key: 'position' },
      ]},
      { title: 'Attendance Record', icon: 'bi-clock', fields: [
        { label: 'Date', key: 'date' },
        { label: 'Check In', key: 'checkIn' },
        { label: 'Check Out', key: 'checkOut' },
        { label: 'Hours Worked', key: 'hours' },
        { label: 'Status', key: 'status' },
        { label: 'Overtime', key: 'overtime' },
      ]},
      { title: 'Additional Info', icon: 'bi-info-circle', fields: [
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'staff-performance': {
    title: d => d.name || 'Staff Performance',
    icon: 'bi-graph-up',
    sections: [
      { title: 'Employee', icon: 'bi-person', fields: [
        { label: 'Name', key: 'name' },
        { label: 'Employee ID', key: 'id' },
        { label: 'Department', key: 'department' },
        { label: 'Role', key: 'role' },
      ]},
      { title: 'Performance Metrics', icon: 'bi-bar-chart', fields: [
        { label: 'Review Period', key: 'period' },
        { label: 'Overall Rating', key: 'rating' },
        { label: 'Tasks Completed', key: 'tasks' },
        { label: 'Attendance Score', key: 'attendance' },
        { label: 'Quality Score', key: 'quality' },
        { label: 'Punctuality', key: 'punctuality' },
      ]},
      { title: 'Review Notes', icon: 'bi-chat-text', fields: [
        { label: 'Manager Comments', key: 'comments', full: true },
        { label: 'Goals', key: 'goals', full: true },
      ]},
    ],
    status: d => d.rating ? statusBadge(d.rating, 'success') : null,
  },
  'payroll': {
    title: d => d.name || 'Payroll Record',
    icon: 'bi-cash-stack',
    sections: [
      { title: 'Employee', icon: 'bi-person', fields: [
        { label: 'Name', key: 'name' },
        { label: 'Employee ID', key: 'id' },
        { label: 'Department', key: 'department' },
        { label: 'Position', key: 'position' },
      ]},
      { title: 'Payment Details', icon: 'bi-wallet2', fields: [
        { label: 'Pay Period', key: 'period' },
        { label: 'Basic Salary', key: 'basic', format: fmtMoney },
        { label: 'Allowances', key: 'allowances', format: fmtMoney },
        { label: 'Overtime', key: 'overtime', format: fmtMoney },
        { label: 'Deductions', key: 'deductions', format: fmtMoney },
        { label: 'Net Pay', key: 'net', format: fmtMoney },
        { label: 'Payment Date', key: 'payDate' },
        { label: 'Payment Method', key: 'method' },
      ]},
      { title: 'Status', icon: 'bi-info-circle', fields: [
        { label: 'Payment Status', key: 'status' },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'staff-commissions': {
    title: d => d.name || 'Commission Record',
    icon: 'bi-cash-coin',
    sections: [
      { title: 'Employee', icon: 'bi-person', fields: [
        { label: 'Name', key: 'name' },
        { label: 'Employee ID', key: 'id' },
        { label: 'Department', key: 'department' },
      ]},
      { title: 'Commission Details', icon: 'bi-cash', fields: [
        { label: 'Commission Period', key: 'period' },
        { label: 'Sales Amount', key: 'sales', format: fmtMoney },
        { label: 'Commission Rate', key: 'rate' },
        { label: 'Commission Amount', key: 'amount', format: fmtMoney },
        { label: 'Payment Date', key: 'payDate' },
        { label: 'Status', key: 'status' },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'activity-logs': {
    title: d => d.action || 'Activity Log',
    icon: 'bi-activity',
    sections: [
      { title: 'Log Details', icon: 'bi-info-circle', fields: [
        { label: 'Action', key: 'action' },
        { label: 'User', key: 'user' },
        { label: 'Module', key: 'module' },
        { label: 'IP Address', key: 'ip' },
        { label: 'Date & Time', key: 'datetime' },
        { label: 'Severity', key: 'severity' },
      ]},
      { title: 'Description', icon: 'bi-file-text', fields: [
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.severity ? statusBadge(d.severity, statusClass(d.severity)) : null,
  },

  // --- Property sub-pages ---
  'property-categories': {
    title: d => d.name || 'Property Category',
    icon: 'bi-tags',
    sections: [
      { title: 'Category Information', icon: 'bi-tag', fields: [
        { label: 'Category Name', key: 'name' },
        { label: 'Category ID', key: 'id' },
        { label: 'Type', key: 'type' },
        { label: 'Description', key: 'description', full: true },
      ]},
      { title: 'Statistics', icon: 'bi-bar-chart', fields: [
        { label: 'Total Properties', key: 'totalProperties' },
        { label: 'Active Listings', key: 'active' },
        { label: 'Vacant', key: 'vacant' },
        { label: 'Occupied', key: 'occupied' },
      ]},
    ],
  },
  'property-documents': {
    title: d => d.name || 'Property Document',
    icon: 'bi-file-earmark-text',
    sections: [
      { title: 'Document Information', icon: 'bi-file-text', fields: [
        { label: 'Document Name', key: 'name' },
        { label: 'Document ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Document Type', key: 'type' },
        { label: 'Upload Date', key: 'uploadDate' },
        { label: 'File Size', key: 'size' },
        { label: 'Uploaded By', key: 'uploadedBy' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Description', icon: 'bi-info-circle', fields: [
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'property-inspections': {
    title: d => d.title || d.property || 'Property Inspection',
    icon: 'bi-clipboard-check',
    sections: [
      { title: 'Inspection Details', icon: 'bi-clipboard', fields: [
        { label: 'Inspection Title', key: 'title' },
        { label: 'Inspection ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Inspection Type', key: 'type' },
        { label: 'Inspector', key: 'inspector' },
        { label: 'Date', key: 'date' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Inspection Results', icon: 'bi-check2-square', fields: [
        { label: 'Overall Condition', key: 'condition' },
        { label: 'Score', key: 'score' },
        { label: 'Issues Found', key: 'issues', full: true },
        { label: 'Recommendations', key: 'recommendations', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'property-media': {
    title: d => d.title || d.name || 'Property Media',
    icon: 'bi-images',
    sections: [
      { title: 'Media Information', icon: 'bi-image', fields: [
        { label: 'Title', key: 'title' },
        { label: 'Media ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Media Type', key: 'type' },
        { label: 'Upload Date', key: 'uploadDate' },
        { label: 'Uploaded By', key: 'uploadedBy' },
        { label: 'File Size', key: 'size' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Description', icon: 'bi-info-circle', fields: [
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'property-valuations': {
    title: d => d.property || 'Property Valuation',
    icon: 'bi-currency-exchange',
    sections: [
      { title: 'Valuation Information', icon: 'bi-cash', fields: [
        { label: 'Property', key: 'property' },
        { label: 'Valuation ID', key: 'id' },
        { label: 'Valuer', key: 'valuer' },
        { label: 'Valuation Date', key: 'date' },
        { label: 'Valuation Type', key: 'type' },
        { label: 'Purpose', key: 'purpose' },
      ]},
      { title: 'Valuation Figures', icon: 'bi-graph-up', fields: [
        { label: 'Market Value', key: 'marketValue', format: fmtMoney },
        { label: 'Rental Value', key: 'rentalValue', format: fmtMoney },
        { label: 'Land Value', key: 'landValue', format: fmtMoney },
        { label: 'Improvement Value', key: 'improvementValue', format: fmtMoney },
      ]},
      { title: 'Notes', icon: 'bi-sticky', fields: [
        { label: 'Valuation Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- Tenant sub-pages ---
  'tenant-payments': {
    title: d => d.tenant || 'Tenant Payment',
    icon: 'bi-credit-card',
    sections: [
      { title: 'Payment Information', icon: 'bi-cash', fields: [
        { label: 'Payment ID', key: 'id' },
        { label: 'Tenant', key: 'tenant' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Amount', key: 'amount', format: fmtMoney },
        { label: 'Payment Date', key: 'date' },
        { label: 'Payment Method', key: 'method' },
        { label: 'Reference', key: 'reference' },
        { label: 'Period', key: 'period' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Additional Info', icon: 'bi-info-circle', fields: [
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'tenant-arrears': {
    title: d => d.tenant || 'Arrears Record',
    icon: 'bi-exclamation-triangle',
    sections: [
      { title: 'Tenant Information', icon: 'bi-person', fields: [
        { label: 'Tenant', key: 'tenant' },
        { label: 'Tenant ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
      ]},
      { title: 'Arrears Details', icon: 'bi-cash-stack', fields: [
        { label: 'Total Arrears', key: 'totalArrears', format: fmtMoney },
        { label: 'Months Owed', key: 'months' },
        { label: 'Last Payment', key: 'lastPayment', format: fmtMoney },
        { label: 'Last Payment Date', key: 'lastPaymentDate' },
        { label: 'Due Date', key: 'dueDate' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Action History', icon: 'bi-clock-history', fields: [
        { label: 'Notices Sent', key: 'noticesSent' },
        { label: 'Last Notice Date', key: 'lastNotice' },
        { label: 'Action Taken', key: 'action', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'tenant-deposits': {
    title: d => d.tenant || 'Tenant Deposit',
    icon: 'bi-safe',
    sections: [
      { title: 'Deposit Information', icon: 'bi-cash', fields: [
        { label: 'Deposit ID', key: 'id' },
        { label: 'Tenant', key: 'tenant' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Deposit Type', key: 'type' },
        { label: 'Amount', key: 'amount', format: fmtMoney },
        { label: 'Date Paid', key: 'datePaid' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Refund Information', icon: 'bi-arrow-return-left', fields: [
        { label: 'Refund Amount', key: 'refundAmount', format: fmtMoney },
        { label: 'Deductions', key: 'deductions', format: fmtMoney },
        { label: 'Refund Date', key: 'refundDate' },
        { label: 'Refund Notes', key: 'refundNotes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'tenant-complaints': {
    title: d => d.subject || d.tenant || 'Tenant Complaint',
    icon: 'bi-megaphone',
    sections: [
      { title: 'Complaint Information', icon: 'bi-chat-square-text', fields: [
        { label: 'Complaint ID', key: 'id' },
        { label: 'Subject', key: 'subject' },
        { label: 'Tenant', key: 'tenant' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Category', key: 'category' },
        { label: 'Priority', key: 'priority' },
        { label: 'Date Filed', key: 'date' },
        { label: 'Assigned To', key: 'assignedTo' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Complaint Details', icon: 'bi-file-text', fields: [
        { label: 'Description', key: 'description', full: true },
        { label: 'Resolution', key: 'resolution', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'tenant-evictions': {
    title: d => d.tenant || 'Eviction Record',
    icon: 'bi-door-closed',
    sections: [
      { title: 'Eviction Information', icon: 'bi-file-earmark-text', fields: [
        { label: 'Eviction ID', key: 'id' },
        { label: 'Tenant', key: 'tenant' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Reason', key: 'reason' },
        { label: 'Notice Date', key: 'noticeDate' },
        { label: 'Eviction Date', key: 'evictionDate' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Legal Information', icon: 'bi-bank', fields: [
        { label: 'Case Number', key: 'caseNumber' },
        { label: 'Lawyer', key: 'lawyer' },
        { label: 'Court Date', key: 'courtDate' },
        { label: 'Legal Notes', key: 'legalNotes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'lease-renewals': {
    title: d => d.tenant || 'Lease Renewal',
    icon: 'bi-file-earmark-plus',
    sections: [
      { title: 'Lease Information', icon: 'bi-file-text', fields: [
        { label: 'Renewal ID', key: 'id' },
        { label: 'Tenant', key: 'tenant' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Current Lease End', key: 'currentEndDate' },
        { label: 'New Lease Start', key: 'newStartDate' },
        { label: 'New Lease End', key: 'newEndDate' },
        { label: 'New Rent', key: 'newRent', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Renewal Details', icon: 'bi-info-circle', fields: [
        { label: 'Terms', key: 'terms', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- BnB sub-pages ---
  'bnb-listings': {
    title: d => d.title || d.name || 'BnB Listing',
    icon: 'bi-house-heart',
    sections: [
      { title: 'Listing Information', icon: 'bi-house', fields: [
        { label: 'Listing Title', key: 'title' },
        { label: 'Listing ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Type', key: 'type' },
        { label: 'Bedrooms', key: 'bedrooms' },
        { label: 'Bathrooms', key: 'bathrooms' },
        { label: 'Max Guests', key: 'maxGuests' },
        { label: 'Nightly Rate', key: 'rate', format: fmtMoney },
      ]},
      { title: 'Listing Status', icon: 'bi-info-circle', fields: [
        { label: 'Status', key: 'status' },
        { label: 'Listed On', key: 'platforms' },
        { label: 'Rating', key: 'rating' },
        { label: 'Total Bookings', key: 'totalBookings' },
      ]},
      { title: 'Description', icon: 'bi-file-text', fields: [
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'bnb-pricing': {
    title: d => d.name || d.property || 'Pricing Plan',
    icon: 'bi-tag',
    sections: [
      { title: 'Pricing Information', icon: 'bi-cash', fields: [
        { label: 'Plan Name', key: 'name' },
        { label: 'Plan ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Season', key: 'season' },
        { label: 'Nightly Rate', key: 'nightly', format: fmtMoney },
        { label: 'Weekly Rate', key: 'weekly', format: fmtMoney },
        { label: 'Monthly Rate', key: 'monthly', format: fmtMoney },
        { label: 'Weekend Rate', key: 'weekend', format: fmtMoney },
        { label: 'Min Stay', key: 'minStay' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Additional Charges', icon: 'bi-plus-circle', fields: [
        { label: 'Cleaning Fee', key: 'cleaningFee', format: fmtMoney },
        { label: 'Service Fee', key: 'serviceFee', format: fmtMoney },
        { label: 'Security Deposit', key: 'deposit', format: fmtMoney },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'bnb-checkin': {
    title: d => d.guest || 'Check-in / Check-out',
    icon: 'bi-key',
    sections: [
      { title: 'Guest Information', icon: 'bi-person', fields: [
        { label: 'Guest Name', key: 'guest' },
        { label: 'Booking ID', key: 'bookingId' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
      ]},
      { title: 'Check-in Details', icon: 'bi-box-arrow-in-right', fields: [
        { label: 'Check-in Date', key: 'checkIn' },
        { label: 'Check-in Time', key: 'checkInTime' },
        { label: 'Check-in Status', key: 'checkInStatus' },
        { label: 'Keys Issued', key: 'keysIssued' },
      ]},
      { title: 'Check-out Details', icon: 'bi-box-arrow-right', fields: [
        { label: 'Check-out Date', key: 'checkOut' },
        { label: 'Check-out Time', key: 'checkOutTime' },
        { label: 'Check-out Status', key: 'checkOutStatus' },
        { label: 'Deposit Refund', key: 'depositRefund', format: fmtMoney },
      ]},
    ],
    status: d => d.checkInStatus ? statusBadge(d.checkInStatus, statusClass(d.checkInStatus)) : null,
  },
  'bnb-channel': {
    title: d => d.channel || d.name || 'Channel Listing',
    icon: 'bi-broadcast',
    sections: [
      { title: 'Channel Information', icon: 'bi-tv', fields: [
        { label: 'Channel', key: 'channel' },
        { label: 'Listing ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Channel Listing ID', key: 'channelListingId' },
        { label: 'Sync Status', key: 'syncStatus' },
        { label: 'Last Synced', key: 'lastSync' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Channel Stats', icon: 'bi-bar-chart', fields: [
        { label: 'Bookings (30d)', key: 'bookings30d' },
        { label: 'Revenue (30d)', key: 'revenue30d', format: fmtMoney },
        { label: 'Rating', key: 'rating' },
        { label: 'Response Rate', key: 'responseRate' },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'bnb-housekeeping': {
    title: d => d.task || d.property || 'Housekeeping Task',
    icon: 'bi-brush',
    sections: [
      { title: 'Task Information', icon: 'bi-clipboard', fields: [
        { label: 'Task', key: 'task' },
        { label: 'Task ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Unit', key: 'unit' },
        { label: 'Assigned To', key: 'assignedTo' },
        { label: 'Task Type', key: 'type' },
        { label: 'Scheduled Date', key: 'date' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Task Details', icon: 'bi-list-check', fields: [
        { label: 'Checklist Items', key: 'checklist', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'bnb-cancellations': {
    title: d => d.guest || 'Cancellation Record',
    icon: 'bi-x-circle',
    sections: [
      { title: 'Cancellation Information', icon: 'bi-calendar-x', fields: [
        { label: 'Cancellation ID', key: 'id' },
        { label: 'Guest', key: 'guest' },
        { label: 'Booking ID', key: 'bookingId' },
        { label: 'Property', key: 'property' },
        { label: 'Cancellation Date', key: 'cancelDate' },
        { label: 'Original Check-in', key: 'originalCheckIn' },
        { label: 'Reason', key: 'reason' },
        { label: 'Refund Amount', key: 'refund', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Additional Info', icon: 'bi-info-circle', fields: [
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'bnb-reviews': {
    title: d => d.guest || 'BnB Review',
    icon: 'bi-star',
    sections: [
      { title: 'Review Information', icon: 'bi-chat-square-quote', fields: [
        { label: 'Review ID', key: 'id' },
        { label: 'Guest', key: 'guest' },
        { label: 'Property', key: 'property' },
        { label: 'Booking ID', key: 'bookingId' },
        { label: 'Rating', key: 'rating' },
        { label: 'Date', key: 'date' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Review Content', icon: 'bi-file-text', fields: [
        { label: 'Review Title', key: 'title' },
        { label: 'Review Text', key: 'review', full: true },
        { label: 'Host Response', key: 'response', full: true },
      ]},
    ],
    status: d => d.rating ? statusBadge(d.rating + ' ★', 'success') : null,
  },

  // --- Hunting sub-pages ---
  'hunting-matches': {
    title: d => d.property || 'Property Match',
    icon: 'bi-bullseye',
    sections: [
      { title: 'Match Information', icon: 'bi-clipboard', fields: [
        { label: 'Property', key: 'property' },
        { label: 'Match ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Request ID', key: 'requestId' },
        { label: 'Match Date', key: 'date' },
        { label: 'Match Score', key: 'score' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Property Details', icon: 'bi-house', fields: [
        { label: 'Location', key: 'location' },
        { label: 'Price Range', key: 'price' },
        { label: 'Features', key: 'features', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'hunting-tours': {
    title: d => d.property || 'Property Tour',
    icon: 'bi-map',
    sections: [
      { title: 'Tour Information', icon: 'bi-calendar', fields: [
        { label: 'Property', key: 'property' },
        { label: 'Tour ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Agent', key: 'agent' },
        { label: 'Tour Date', key: 'date' },
        { label: 'Time', key: 'time' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Tour Details', icon: 'bi-info-circle', fields: [
        { label: 'Meeting Point', key: 'meetingPoint' },
        { label: 'Duration', key: 'duration' },
        { label: 'Client Feedback', key: 'feedback', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'hunting-requests': {
    title: d => d.client || 'House Hunting Request',
    icon: 'bi-search',
    sections: [
      { title: 'Request Information', icon: 'bi-file-text', fields: [
        { label: 'Request ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Contact', key: 'contact' },
        { label: 'Email', key: 'email' },
        { label: 'Request Date', key: 'date' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Requirements', icon: 'bi-list-check', fields: [
        { label: 'Property Type', key: 'propertyType' },
        { label: 'Location', key: 'location' },
        { label: 'Min Budget', key: 'minBudget', format: fmtMoney },
        { label: 'Max Budget', key: 'maxBudget', format: fmtMoney },
        { label: 'Bedrooms', key: 'bedrooms' },
        { label: 'Bathrooms', key: 'bathrooms' },
        { label: 'Special Requirements', key: 'requirements', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'hunting-agent-assignment': {
    title: d => d.agent || 'Agent Assignment',
    icon: 'bi-person-badge',
    sections: [
      { title: 'Assignment Information', icon: 'bi-clipboard', fields: [
        { label: 'Assignment ID', key: 'id' },
        { label: 'Agent', key: 'agent' },
        { label: 'Client', key: 'client' },
        { label: 'Request ID', key: 'requestId' },
        { label: 'Assigned Date', key: 'assignedDate' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Assignment Details', icon: 'bi-info-circle', fields: [
        { label: 'Properties Shown', key: 'propertiesShown' },
        { label: 'Tours Completed', key: 'toursCompleted' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'hunting-feedback': {
    title: d => d.client || 'Client Feedback',
    icon: 'bi-chat-heart',
    sections: [
      { title: 'Feedback Information', icon: 'bi-chat-quote', fields: [
        { label: 'Feedback ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Agent', key: 'agent' },
        { label: 'Property', key: 'property' },
        { label: 'Date', key: 'date' },
        { label: 'Rating', key: 'rating' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Feedback Content', icon: 'bi-file-text', fields: [
        { label: 'Feedback', key: 'feedback', full: true },
        { label: 'Agent Response', key: 'response', full: true },
      ]},
    ],
    status: d => d.rating ? statusBadge(d.rating + ' ★', 'success') : null,
  },
  'hunting-fees': {
    title: d => d.client || 'Service Fee',
    icon: 'bi-cash-coin',
    sections: [
      { title: 'Fee Information', icon: 'bi-cash', fields: [
        { label: 'Fee ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Service Type', key: 'serviceType' },
        { label: 'Amount', key: 'amount', format: fmtMoney },
        { label: 'Date Charged', key: 'date' },
        { label: 'Payment Status', key: 'status' },
        { label: 'Payment Method', key: 'method' },
      ]},
      { title: 'Additional Info', icon: 'bi-info-circle', fields: [
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- Sales sub-pages ---
  'sales-listings': {
    title: d => d.title || d.property || 'Sales Listing',
    icon: 'bi-shop',
    sections: [
      { title: 'Listing Information', icon: 'bi-tag', fields: [
        { label: 'Listing Title', key: 'title' },
        { label: 'Listing ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Type', key: 'type' },
        { label: 'Listing Date', key: 'listDate' },
        { label: 'Asking Price', key: 'price', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Property Details', icon: 'bi-house', fields: [
        { label: 'Bedrooms', key: 'bedrooms' },
        { label: 'Bathrooms', key: 'bathrooms' },
        { label: 'Area (sqft)', key: 'area' },
        { label: 'Location', key: 'location' },
      ]},
      { title: 'Description', icon: 'bi-file-text', fields: [
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'sales-site-visits': {
    title: d => d.client || 'Site Visit',
    icon: 'bi-geo-alt',
    sections: [
      { title: 'Visit Information', icon: 'bi-calendar', fields: [
        { label: 'Visit ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Property', key: 'property' },
        { label: 'Agent', key: 'agent' },
        { label: 'Visit Date', key: 'date' },
        { label: 'Visit Time', key: 'time' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Visit Details', icon: 'bi-info-circle', fields: [
        { label: 'Client Feedback', key: 'feedback', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'sales-offers': {
    title: d => d.client || 'Sales Offer',
    icon: 'bi-file-earmark-text',
    sections: [
      { title: 'Offer Information', icon: 'bi-cash', fields: [
        { label: 'Offer ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Property', key: 'property' },
        { label: 'Offer Amount', key: 'amount', format: fmtMoney },
        { label: 'Offer Date', key: 'date' },
        { label: 'Asking Price', key: 'askingPrice', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Offer Terms', icon: 'bi-list-check', fields: [
        { label: 'Financing Type', key: 'financing' },
        { label: 'Closing Date', key: 'closingDate' },
        { label: 'Contingencies', key: 'contingencies', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'sales-agreements': {
    title: d => d.client || 'Sales Agreement',
    icon: 'bi-file-earmark-check',
    sections: [
      { title: 'Agreement Information', icon: 'bi-file-text', fields: [
        { label: 'Agreement ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Property', key: 'property' },
        { label: 'Agreement Date', key: 'date' },
        { label: 'Sale Price', key: 'price', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Agreement Terms', icon: 'bi-list-check', fields: [
        { label: 'Closing Date', key: 'closingDate' },
        { label: 'Deposit Amount', key: 'deposit', format: fmtMoney },
        { label: 'Financing Terms', key: 'financing' },
        { label: 'Terms', key: 'terms', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'sales-payment-plans': {
    title: d => d.client || 'Payment Plan',
    icon: 'bi-calendar2-check',
    sections: [
      { title: 'Plan Information', icon: 'bi-file-text', fields: [
        { label: 'Plan ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Property', key: 'property' },
        { label: 'Total Amount', key: 'total', format: fmtMoney },
        { label: 'Installments', key: 'installments' },
        { label: 'Frequency', key: 'frequency' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Payment Schedule', icon: 'bi-calendar-check', fields: [
        { label: 'Down Payment', key: 'downPayment', format: fmtMoney },
        { label: 'Installment Amount', key: 'installmentAmount', format: fmtMoney },
        { label: 'First Payment', key: 'firstPayment' },
        { label: 'Final Payment', key: 'finalPayment' },
        { label: 'Paid So Far', key: 'paidSoFar', format: fmtMoney },
        { label: 'Balance', key: 'balance', format: fmtMoney },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'sales-title-transfer': {
    title: d => d.client || 'Title Transfer',
    icon: 'bi-file-earmark-stamped',
    sections: [
      { title: 'Transfer Information', icon: 'bi-file-text', fields: [
        { label: 'Transfer ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Property', key: 'property' },
        { label: 'Transfer Date', key: 'date' },
        { label: 'Transfer Type', key: 'type' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Transfer Details', icon: 'bi-info-circle', fields: [
        { label: 'Title Number', key: 'titleNumber' },
        { label: 'Previous Owner', key: 'previousOwner' },
        { label: 'New Owner', key: 'newOwner' },
        { label: 'Transfer Fee', key: 'fee', format: fmtMoney },
        { label: 'Registry', key: 'registry' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- CRM sub-pages ---
  'crm-clients': {
    title: d => d.name || 'Client Details',
    icon: 'bi-person-vcard',
    sections: [
      { title: 'Client Information', icon: 'bi-person', fields: [
        { label: 'Name', key: 'name' },
        { label: 'Client ID', key: 'id' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Type', key: 'type' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Contact Information', icon: 'bi-geo-alt', fields: [
        { label: 'Address', key: 'address', full: true },
        { label: 'City', key: 'city' },
        { label: 'Country', key: 'country' },
      ]},
      { title: 'Client Activity', icon: 'bi-activity', fields: [
        { label: 'Total Deals', key: 'totalDeals' },
        { label: 'Total Value', key: 'totalValue', format: fmtMoney },
        { label: 'Last Contact', key: 'lastContact' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'crm-leads': {
    title: d => d.name || 'Lead Details',
    icon: 'bi-funnel',
    sections: [
      { title: 'Lead Information', icon: 'bi-person', fields: [
        { label: 'Name', key: 'name' },
        { label: 'Lead ID', key: 'id' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Source', key: 'source' },
        { label: 'Stage', key: 'stage' },
        { label: 'Assigned To', key: 'assignedTo' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Lead Details', icon: 'bi-info-circle', fields: [
        { label: 'Interest', key: 'interest' },
        { label: 'Budget', key: 'budget', format: fmtMoney },
        { label: 'Timeline', key: 'timeline' },
        { label: 'Created Date', key: 'createdDate' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'crm-pipeline': {
    title: d => d.name || 'Pipeline Deal',
    icon: 'bi-diagram-3',
    sections: [
      { title: 'Deal Information', icon: 'bi-briefcase', fields: [
        { label: 'Deal Name', key: 'name' },
        { label: 'Deal ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Property', key: 'property' },
        { label: 'Value', key: 'value', format: fmtMoney },
        { label: 'Stage', key: 'stage' },
        { label: 'Probability', key: 'probability' },
        { label: 'Expected Close', key: 'expectedClose' },
        { label: 'Assigned To', key: 'assignedTo' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Deal Notes', icon: 'bi-sticky', fields: [
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.stage ? statusBadge(d.stage, statusClass(d.stage)) : null,
  },
  'crm-communication': {
    title: d => d.client || 'Communication Record',
    icon: 'bi-chat-dots',
    sections: [
      { title: 'Communication Information', icon: 'bi-chat', fields: [
        { label: 'Record ID', key: 'id' },
        { label: 'Client', key: 'client' },
        { label: 'Type', key: 'type' },
        { label: 'Direction', key: 'direction' },
        { label: 'Date', key: 'date' },
        { label: 'Duration', key: 'duration' },
        { label: 'Handled By', key: 'handledBy' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Communication Content', icon: 'bi-file-text', fields: [
        { label: 'Subject', key: 'subject' },
        { label: 'Summary', key: 'summary', full: true },
        { label: 'Action Items', key: 'actionItems', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'crm-segments': {
    title: d => d.name || 'Client Segment',
    icon: 'bi-people',
    sections: [
      { title: 'Segment Information', icon: 'bi-tag', fields: [
        { label: 'Segment Name', key: 'name' },
        { label: 'Segment ID', key: 'id' },
        { label: 'Criteria', key: 'criteria' },
        { label: 'Created Date', key: 'createdDate' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Segment Statistics', icon: 'bi-bar-chart', fields: [
        { label: 'Total Clients', key: 'totalClients' },
        { label: 'Active Clients', key: 'activeClients' },
        { label: 'Total Value', key: 'totalValue', format: fmtMoney },
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'crm-referrals': {
    title: d => d.referred || 'Referral Record',
    icon: 'bi-person-plus',
    sections: [
      { title: 'Referral Information', icon: 'bi-person-plus', fields: [
        { label: 'Referral ID', key: 'id' },
        { label: 'Referred By', key: 'referredBy' },
        { label: 'Referred', key: 'referred' },
        { label: 'Date', key: 'date' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Referral Details', icon: 'bi-info-circle', fields: [
        { label: 'Property Interest', key: 'property' },
        { label: 'Commission', key: 'commission', format: fmtMoney },
        { label: 'Converted', key: 'converted' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- Marketing sub-pages ---
  'marketing-promotions': {
    title: d => d.name || 'Promotion',
    icon: 'bi-megaphone',
    sections: [
      { title: 'Promotion Information', icon: 'bi-tag', fields: [
        { label: 'Promotion Name', key: 'name' },
        { label: 'Promotion ID', key: 'id' },
        { label: 'Type', key: 'type' },
        { label: 'Start Date', key: 'startDate' },
        { label: 'End Date', key: 'endDate' },
        { label: 'Discount', key: 'discount' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Performance', icon: 'bi-graph-up', fields: [
        { label: 'Properties Applied', key: 'properties' },
        { label: 'Bookings', key: 'bookings' },
        { label: 'Revenue Impact', key: 'revenue', format: fmtMoney },
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'marketing-campaigns': {
    title: d => d.name || 'Marketing Campaign',
    icon: 'bi-broadcast',
    sections: [
      { title: 'Campaign Information', icon: 'bi-megaphone', fields: [
        { label: 'Campaign Name', key: 'name' },
        { label: 'Campaign ID', key: 'id' },
        { label: 'Channel', key: 'channel' },
        { label: 'Start Date', key: 'startDate' },
        { label: 'End Date', key: 'endDate' },
        { label: 'Budget', key: 'budget', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Campaign Performance', icon: 'bi-graph-up', fields: [
        { label: 'Impressions', key: 'impressions' },
        { label: 'Clicks', key: 'clicks' },
        { label: 'Conversions', key: 'conversions' },
        { label: 'Cost per Lead', key: 'cpl', format: fmtMoney },
        { label: 'ROI', key: 'roi' },
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'marketing-website-sync': {
    title: d => d.property || 'Website Sync Record',
    icon: 'bi-globe',
    sections: [
      { title: 'Sync Information', icon: 'bi-arrow-repeat', fields: [
        { label: 'Sync ID', key: 'id' },
        { label: 'Property', key: 'property' },
        { label: 'Website', key: 'website' },
        { label: 'Last Sync', key: 'lastSync' },
        { label: 'Sync Status', key: 'syncStatus' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Sync Details', icon: 'bi-info-circle', fields: [
        { label: 'Items Synced', key: 'itemsSynced' },
        { label: 'Errors', key: 'errors' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'marketing-social': {
    title: d => d.platform || 'Social Media Post',
    icon: 'bi-share',
    sections: [
      { title: 'Post Information', icon: 'bi-postcard', fields: [
        { label: 'Post ID', key: 'id' },
        { label: 'Platform', key: 'platform' },
        { label: 'Property', key: 'property' },
        { label: 'Post Date', key: 'date' },
        { label: 'Post Type', key: 'type' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Post Performance', icon: 'bi-graph-up', fields: [
        { label: 'Likes', key: 'likes' },
        { label: 'Comments', key: 'comments' },
        { label: 'Shares', key: 'shares' },
        { label: 'Reach', key: 'reach' },
        { label: 'Content', key: 'content', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'marketing-sources': {
    title: d => d.name || 'Lead Source',
    icon: 'bi-signpost',
    sections: [
      { title: 'Source Information', icon: 'bi-tag', fields: [
        { label: 'Source Name', key: 'name' },
        { label: 'Source ID', key: 'id' },
        { label: 'Type', key: 'type' },
        { label: 'Cost', key: 'cost', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Source Performance', icon: 'bi-bar-chart', fields: [
        { label: 'Total Leads', key: 'totalLeads' },
        { label: 'Converted', key: 'converted' },
        { label: 'Conversion Rate', key: 'conversionRate' },
        { label: 'Cost per Lead', key: 'cpl', format: fmtMoney },
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- Vendor sub-pages ---
  'vendors': {
    title: d => d.name || 'Vendor Details',
    icon: 'bi-building',
    sections: [
      { title: 'Vendor Information', icon: 'bi-building', fields: [
        { label: 'Vendor Name', key: 'name' },
        { label: 'Vendor ID', key: 'id' },
        { label: 'Category', key: 'category' },
        { label: 'Contact Person', key: 'contactPerson' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Business Information', icon: 'bi-briefcase', fields: [
        { label: 'Address', key: 'address', full: true },
        { label: 'City', key: 'city' },
        { label: 'Tax ID', key: 'taxId' },
        { label: 'Rating', key: 'rating' },
      ]},
      { title: 'Performance', icon: 'bi-graph-up', fields: [
        { label: 'Total Contracts', key: 'totalContracts' },
        { label: 'Active Contracts', key: 'activeContracts' },
        { label: 'Total Paid', key: 'totalPaid', format: fmtMoney },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'vendor-contracts': {
    title: d => d.vendor || 'Service Contract',
    icon: 'bi-file-earmark-text',
    sections: [
      { title: 'Contract Information', icon: 'bi-file-text', fields: [
        { label: 'Contract ID', key: 'id' },
        { label: 'Vendor', key: 'vendor' },
        { label: 'Contract Type', key: 'type' },
        { label: 'Start Date', key: 'startDate' },
        { label: 'End Date', key: 'endDate' },
        { label: 'Value', key: 'value', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Contract Terms', icon: 'bi-list-check', fields: [
        { label: 'Scope of Work', key: 'scope', full: true },
        { label: 'Payment Terms', key: 'paymentTerms' },
        { label: 'Renewal Date', key: 'renewalDate' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'vendor-work-orders': {
    title: d => d.title || 'Work Order',
    icon: 'bi-tools',
    sections: [
      { title: 'Work Order Information', icon: 'bi-clipboard', fields: [
        { label: 'Work Order #', key: 'id' },
        { label: 'Title', key: 'title' },
        { label: 'Vendor', key: 'vendor' },
        { label: 'Property', key: 'property' },
        { label: 'Priority', key: 'priority' },
        { label: 'Created Date', key: 'createdDate' },
        { label: 'Due Date', key: 'dueDate' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Work Details', icon: 'bi-list-check', fields: [
        { label: 'Description', key: 'description', full: true },
        { label: 'Estimated Cost', key: 'estimatedCost', format: fmtMoney },
        { label: 'Actual Cost', key: 'actualCost', format: fmtMoney },
        { label: 'Assigned To', key: 'assignedTo' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'vendor-payments': {
    title: d => d.vendor || 'Vendor Payment',
    icon: 'bi-cash-stack',
    sections: [
      { title: 'Payment Information', icon: 'bi-cash', fields: [
        { label: 'Payment ID', key: 'id' },
        { label: 'Vendor', key: 'vendor' },
        { label: 'Invoice #', key: 'invoice' },
        { label: 'Amount', key: 'amount', format: fmtMoney },
        { label: 'Payment Date', key: 'date' },
        { label: 'Payment Method', key: 'method' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Additional Info', icon: 'bi-info-circle', fields: [
        { label: 'Description', key: 'description', full: true },
        { label: 'Reference', key: 'reference' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- Communication sub-pages ---
  'comm-emails': {
    title: d => d.subject || 'Email Record',
    icon: 'bi-envelope',
    sections: [
      { title: 'Email Information', icon: 'bi-envelope', fields: [
        { label: 'Email ID', key: 'id' },
        { label: 'Subject', key: 'subject' },
        { label: 'From', key: 'from' },
        { label: 'To', key: 'to' },
        { label: 'Date', key: 'date' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Email Content', icon: 'bi-file-text', fields: [
        { label: 'Body', key: 'body', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'comm-sms': {
    title: d => d.to || 'SMS Record',
    icon: 'bi-chat-left-text',
    sections: [
      { title: 'SMS Information', icon: 'bi-chat', fields: [
        { label: 'SMS ID', key: 'id' },
        { label: 'From', key: 'from' },
        { label: 'To', key: 'to' },
        { label: 'Date', key: 'date' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Message Content', icon: 'bi-file-text', fields: [
        { label: 'Message', key: 'message', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'comm-templates': {
    title: d => d.name || 'Communication Template',
    icon: 'bi-file-earmark-code',
    sections: [
      { title: 'Template Information', icon: 'bi-file-text', fields: [
        { label: 'Template Name', key: 'name' },
        { label: 'Template ID', key: 'id' },
        { label: 'Type', key: 'type' },
        { label: 'Category', key: 'category' },
        { label: 'Created Date', key: 'createdDate' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Template Content', icon: 'bi-code', fields: [
        { label: 'Subject', key: 'subject' },
        { label: 'Body', key: 'body', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'comm-history': {
    title: d => d.recipient || 'Communication History',
    icon: 'bi-clock-history',
    sections: [
      { title: 'Communication Information', icon: 'bi-chat', fields: [
        { label: 'Record ID', key: 'id' },
        { label: 'Type', key: 'type' },
        { label: 'Recipient', key: 'recipient' },
        { label: 'Subject', key: 'subject' },
        { label: 'Date', key: 'date' },
        { label: 'Sent By', key: 'sentBy' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Content', icon: 'bi-file-text', fields: [
        { label: 'Message', key: 'message', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- Analytics / Notice sub-pages ---
  'settings-templates': {
    title: d => d.name || 'Template',
    icon: 'bi-file-earmark-code',
    sections: [
      { title: 'Template Information', icon: 'bi-file-text', fields: [
        { label: 'Template Name', key: 'name' },
        { label: 'Template ID', key: 'id' },
        { label: 'Type', key: 'type' },
        { label: 'Category', key: 'category' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Template Content', icon: 'bi-code', fields: [
        { label: 'Subject', key: 'subject' },
        { label: 'Body', key: 'body', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'analytics-property': {
    title: d => d.property || 'Property Analytics',
    icon: 'bi-graph-up',
    sections: [
      { title: 'Property Information', icon: 'bi-house', fields: [
        { label: 'Property', key: 'property' },
        { label: 'Property ID', key: 'id' },
        { label: 'Type', key: 'type' },
        { label: 'Location', key: 'location' },
      ]},
      { title: 'Performance Metrics', icon: 'bi-bar-chart', fields: [
        { label: 'Occupancy Rate', key: 'occupancy' },
        { label: 'Monthly Revenue', key: 'revenue', format: fmtMoney },
        { label: 'Expenses', key: 'expenses', format: fmtMoney },
        { label: 'Net Income', key: 'netIncome', format: fmtMoney },
        { label: 'ROI', key: 'roi' },
        { label: 'Total Units', key: 'totalUnits' },
      ]},
    ],
  },
  'notice-everyone': {
    title: d => d.title || 'Notice',
    icon: 'bi-megaphone',
    sections: [
      { title: 'Notice Information', icon: 'bi-info-circle', fields: [
        { label: 'Title', key: 'title' },
        { label: 'Notice ID', key: 'id' },
        { label: 'Posted By', key: 'postedBy' },
        { label: 'Date', key: 'date' },
        { label: 'Priority', key: 'priority' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Notice Content', icon: 'bi-file-text', fields: [
        { label: 'Content', key: 'content', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'notice-tenants': {
    title: d => d.title || 'Tenant Notice',
    icon: 'bi-megaphone',
    sections: [
      { title: 'Notice Information', icon: 'bi-info-circle', fields: [
        { label: 'Title', key: 'title' },
        { label: 'Notice ID', key: 'id' },
        { label: 'Posted By', key: 'postedBy' },
        { label: 'Date', key: 'date' },
        { label: 'Priority', key: 'priority' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Notice Content', icon: 'bi-file-text', fields: [
        { label: 'Content', key: 'content', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- Construction sub-pages ---
  'construction-tasks': {
    title: d => d.task || 'Construction Task',
    icon: 'bi-list-task',
    sections: [
      { title: 'Task Information', icon: 'bi-clipboard', fields: [
        { label: 'Task', key: 'task' },
        { label: 'Task ID', key: 'id' },
        { label: 'Project', key: 'project' },
        { label: 'Assigned To', key: 'assignedTo' },
        { label: 'Start Date', key: 'startDate' },
        { label: 'Due Date', key: 'dueDate' },
        { label: 'Progress', key: 'progress' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Task Details', icon: 'bi-info-circle', fields: [
        { label: 'Description', key: 'description', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'construction-materials': {
    title: d => d.name || 'Construction Material',
    icon: 'bi-boxes',
    sections: [
      { title: 'Material Information', icon: 'bi-box', fields: [
        { label: 'Material Name', key: 'name' },
        { label: 'Material ID', key: 'id' },
        { label: 'Project', key: 'project' },
        { label: 'Quantity', key: 'quantity' },
        { label: 'Unit', key: 'unit' },
        { label: 'Unit Cost', key: 'unitCost', format: fmtMoney },
        { label: 'Total Cost', key: 'totalCost', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Supplier Information', icon: 'bi-truck', fields: [
        { label: 'Supplier', key: 'supplier' },
        { label: 'Order Date', key: 'orderDate' },
        { label: 'Delivery Date', key: 'deliveryDate' },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- Construction sub-pages (projects/contractors have partial offcanvas wiring) ---
  'construction-projects': {
    title: d => d.name || d.project || 'Construction Project',
    icon: 'bi-building',
    sections: [
      { title: 'Project Information', icon: 'bi-clipboard', fields: [
        { label: 'Project Name', key: 'name' },
        { label: 'Project ID', key: 'id' },
        { label: 'Location', key: 'location' },
        { label: 'Type', key: 'type' },
        { label: 'Start Date', key: 'startDate' },
        { label: 'End Date', key: 'endDate' },
        { label: 'Budget', key: 'budget', format: fmtMoney },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Project Details', icon: 'bi-info-circle', fields: [
        { label: 'Progress', key: 'progress' },
        { label: 'Contractor', key: 'contractor' },
        { label: 'Description', key: 'description', full: true },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
  'construction-contractors': {
    title: d => d.name || 'Contractor',
    icon: 'bi-person-badge',
    sections: [
      { title: 'Contractor Information', icon: 'bi-building', fields: [
        { label: 'Contractor Name', key: 'name' },
        { label: 'Contractor ID', key: 'id' },
        { label: 'Company', key: 'company' },
        { label: 'Specialization', key: 'specialization' },
        { label: 'Phone', key: 'phone' },
        { label: 'Email', key: 'email' },
        { label: 'Rating', key: 'rating' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Performance', icon: 'bi-graph-up', fields: [
        { label: 'Active Projects', key: 'activeProjects' },
        { label: 'Completed Projects', key: 'completedProjects' },
        { label: 'Total Value', key: 'totalValue', format: fmtMoney },
        { label: 'Notes', key: 'notes', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },

  // --- Departments ---
  'departments': {
    title: d => d.name || 'Department',
    icon: 'bi-diagram-3',
    sections: [
      { title: 'Department Information', icon: 'bi-building', fields: [
        { label: 'Department Name', key: 'name' },
        { label: 'Department ID', key: 'id' },
        { label: 'Head of Department', key: 'head' },
        { label: 'Status', key: 'status' },
      ]},
      { title: 'Team Statistics', icon: 'bi-people', fields: [
        { label: 'Total Staff', key: 'totalStaff' },
        { label: 'Active Staff', key: 'activeStaff' },
        { label: 'Description', key: 'description', full: true },
      ]},
    ],
    status: d => d.status ? statusBadge(d.status, statusClass(d.status)) : null,
  },
};

// ============================================
// Status class helper
// ============================================
function statusClass(status) {
  if (!status) return 'primary';
  const s = String(status).toLowerCase();
  if (s.includes('active') || s.includes('paid') || s.includes('completed') || s.includes('done') || s.includes('approved') || s.includes('confirmed') || s.includes('success') || s.includes('verified')) return 'success';
  if (s.includes('pending') || s.includes('progress') || s.includes('review') || s.includes('waiting')) return 'warning';
  if (s.includes('overdue') || s.includes('late') || s.includes('rejected') || s.includes('failed') || s.includes('cancelled') || s.includes('evicted') || s.includes('default')) return 'danger';
  if (s.includes('draft') || s.includes('inactive') || s.includes('archived')) return 'secondary';
  return 'primary';
}

// ============================================
// Extract row data from a table row
// Maps header text to config field keys using fuzzy matching
// ============================================
function extractRowData(row) {
  const cells = row.querySelectorAll('td');
  const data = {};
  const table = row.closest('table');
  const headers = table ? table.querySelectorAll('thead th') : [];
  const headerTexts = headers.length ? Array.from(headers).map(h => h.textContent.trim()) : [];

  cells.forEach((cell, i) => {
    // Skip action button cells
    if (cell.querySelector('.action-buttons') || cell.querySelector('button')) {
      return;
    }
    const headerText = headerTexts[i] || '';
    const value = cell.textContent.trim();
    // Simple key: lowercase, remove non-alphanumeric
    const simpleKey = headerText.toLowerCase().replace(/[^a-z0-9]/g, '');
    data[simpleKey] = value;
    // Also store under common field name aliases
    const lower = headerText.toLowerCase();
    if (lower.includes('name')) data.name = data.name || value;
    if (lower === 'id' || lower.includes(' id') || lower.endsWith('id') || lower.includes('number') || lower.includes('ref')) data.id = data.id || value;
    if (lower.includes('status')) data.status = data.status || value;
    if (lower.includes('date')) data.date = data.date || value;
    if (lower.includes('type')) data.type = data.type || value;
    if (lower.includes('amount') || lower.includes('price') || lower.includes('cost') || lower.includes('value') || lower.includes('salary') || lower.includes('pay') || lower.includes('rent') || lower.includes('fee')) data.amount = data.amount || value;
    if (lower.includes('property')) data.property = data.property || value;
    if (lower.includes('tenant')) data.tenant = data.tenant || value;
    if (lower.includes('unit')) data.unit = data.unit || value;
    if (lower.includes('vendor') || lower.includes('supplier')) data.vendor = data.vendor || value;
    if (lower.includes('client') || lower.includes('customer')) data.client = data.client || value;
    if (lower.includes('agent')) data.agent = data.agent || value;
    if (lower.includes('guest')) data.guest = data.guest || value;
    if (lower.includes('user') || lower.includes('employee') || lower.includes('staff')) data.name = data.name || value;
    if (lower.includes('email')) data.email = data.email || value;
    if (lower.includes('phone') || lower.includes('contact') || lower.includes('mobile')) data.phone = data.phone || value;
    if (lower.includes('department')) data.department = data.department || value;
    if (lower.includes('position') || lower.includes('role')) data.position = data.position || value;
    if (lower.includes('subject') || lower.includes('title')) data.subject = data.subject || value;
    if (lower.includes('description') || lower.includes('notes') || lower.includes('comment')) data.description = data.description || value;
    if (lower.includes('location')) data.location = data.location || value;
    if (lower.includes('rating') || lower.includes('score')) data.rating = data.rating || value;
    if (lower.includes('priority')) data.priority = data.priority || value;
    if (lower.includes('category')) data.category = data.category || value;
    if (lower.includes('method')) data.method = data.method || value;
    if (lower.includes('period')) data.period = data.period || value;
    if (lower.includes('budget')) data.budget = data.budget || value;
    if (lower.includes('progress')) data.progress = data.progress || value;
    if (lower.includes('project')) data.project = data.project || value;
    if (lower.includes('task')) data.task = data.task || value;
    if (lower.includes('quantity')) data.quantity = data.quantity || value;
    if (lower.includes('assigned') || lower.includes('inspector') || lower.includes('valuer') || lower.includes('lawyer') || lower.includes('manager') || lower.includes('head')) data.assignedTo = data.assignedTo || value;
    if (lower.includes('reason')) data.reason = data.reason || value;
    if (lower.includes('source')) data.source = data.source || value;
    if (lower.includes('stage')) data.stage = data.stage || value;
    if (lower.includes('channel') || lower.includes('platform')) data.channel = data.channel || value;
    if (lower.includes('start')) data.startDate = data.startDate || value;
    if (lower.includes('end')) data.endDate = data.endDate || value;
    if (lower.includes('due')) data.dueDate = data.dueDate || value;
    if (lower.includes('created')) data.createdDate = data.createdDate || value;
    if (lower.includes('upload')) data.uploadDate = data.uploadDate || value;
    if (lower.includes('posted') || lower.includes('sent') || lower.includes('handled')) data.date = data.date || value;
  });

  return data;
}

// ============================================
// Render the detail offcanvas
// ============================================
function renderDetailOffcanvas(pageType, data) {
  const config = DETAIL_CONFIGS[pageType];
  if (!config) {
    console.warn('No detail config for page type:', pageType);
    return;
  }

  const titleEl = document.getElementById('detailOffcanvasTitle');
  const bodyEl = document.getElementById('detailOffcanvasBody');
  const footerEl = document.getElementById('detailOffcanvasFooter');

  // Set title
  const titleText = config.title(data);
  titleEl.innerHTML = `<i class="bi ${config.icon}"></i> ${titleText}`;

  // Build body HTML
  let html = '';

  // Status badge at top
  if (config.status) {
    const statusHtml = config.status(data);
    if (statusHtml) {
      html += `<div style="margin-bottom: 16px;">${statusHtml}</div>`;
    }
  }

  // Render sections
  config.sections.forEach(section => {
    html += `<div class="offcanvas-section">`;
    html += `<div class="offcanvas-section-title"><i class="bi ${section.icon}"></i> ${section.title}</div>`;
    html += `<div class="offcanvas-info-grid">`;

    section.fields.forEach(field => {
      let val = data[field.key];
      // Fallback: try simple key match
      if (val === undefined) {
        const simpleKey = field.key.toLowerCase().replace(/[^a-z0-9]/g, '');
        val = data[simpleKey];
      }
      val = field.format ? field.format(val) : fmt(val);
      html += `<div class="offcanvas-info-item${field.full ? ' full-width' : ''}">`;
      html += `<div class="label">${field.label}</div>`;
      html += `<div class="value">${val}</div>`;
      html += `</div>`;
    });

    html += `</div></div>`;
  });

  bodyEl.innerHTML = html;

  // Footer with action buttons
  let footerHtml = '<button class="btn btn-outline-secondary btn-sm" onclick="DomiaApp.closeDetailOffcanvas()">Close</button>';
  footerHtml += '<button class="btn btn-primary btn-sm"><i class="bi bi-pencil"></i> Edit</button>';
  footerEl.innerHTML = footerHtml;
}

// ============================================
// Open detail offcanvas
// ============================================
function openDetailOffcanvas(pageType, data) {
  renderDetailOffcanvas(pageType, data || {});
  const panel = document.getElementById('detailOffcanvas');
  const overlay = document.getElementById('offcanvasOverlay');
  if (panel) {
    panel.classList.add('open');
  }
  if (overlay) {
    overlay.classList.add('show');
  }
  document.body.style.overflow = 'hidden';
}

function closeDetailOffcanvas() {
  const panel = document.getElementById('detailOffcanvas');
  const overlay = document.getElementById('offcanvasOverlay');
  if (panel) {
    panel.classList.remove('open');
  }
  if (overlay) {
    overlay.classList.remove('show');
  }
  document.body.style.overflow = '';
}

// ============================================
// Wire up all eye buttons on pages without handlers
// ============================================
function initDetailButtons() {
  // Map page IDs to detail config keys
  const pageMap = {
    // Core entity pages - use sliding panel instead of full page
    'page-tenants': 'tenant',
    'page-maintainers': 'maintainer',
    'page-agreements': 'agreement',
    // Pages with existing offcanvas - redirect to generic panel
    'page-maintenance-all': 'maintenance',
    'page-maintenance-pending': 'maintenance',
    'page-maintenance-progress': 'maintenance',
    'page-maintenance-done': 'maintenance',
    'page-invoices': 'invoice',
    'page-expenses': 'expense',
    'page-overdue-rent': 'overdue-rent',
    'page-bnb-bookings': 'bnb-booking',
    'page-bnb-guests': 'bnb-guest',
    'page-sales-leads': 'sales-lead',
    'page-sales-pipeline': 'sales-pipeline',
    'page-sales-commissions': 'sales-commission',
    'page-construction-projects': 'construction-project',
    'page-construction-contractors': 'construction-contractor',
    'page-calendar': 'calendar',
    'page-contact-diary': 'contact-diary',
    'page-notice-board': 'notice-board',
    // Staff / HR
    'page-staff-attendance': 'staff-attendance',
    'page-staff-performance': 'staff-performance',
    'page-payroll': 'payroll',
    'page-staff-commissions': 'staff-commissions',
    'page-activity-logs': 'activity-logs',
    'page-property-categories': 'property-categories',
    'page-property-documents': 'property-documents',
    'page-property-inspections': 'property-inspections',
    'page-property-media': 'property-media',
    'page-property-valuations': 'property-valuations',
    'page-tenant-payments': 'tenant-payments',
    'page-tenant-arrears': 'tenant-arrears',
    'page-tenant-deposits': 'tenant-deposits',
    'page-tenant-complaints': 'tenant-complaints',
    'page-tenant-evictions': 'tenant-evictions',
    'page-lease-renewals': 'lease-renewals',
    'page-bnb-listings': 'bnb-listings',
    'page-bnb-pricing': 'bnb-pricing',
    'page-bnb-checkin': 'bnb-checkin',
    'page-bnb-channel': 'bnb-channel',
    'page-bnb-housekeeping': 'bnb-housekeeping',
    'page-bnb-cancellations': 'bnb-cancellations',
    'page-bnb-reviews': 'bnb-reviews',
    'page-hunting-requests': 'hunting-requests',
    'page-hunting-matches': 'hunting-matches',
    'page-hunting-tours': 'hunting-tours',
    'page-hunting-agent-assignment': 'hunting-agent-assignment',
    'page-hunting-feedback': 'hunting-feedback',
    'page-hunting-fees': 'hunting-fees',
    'page-sales-listings': 'sales-listings',
    'page-sales-site-visits': 'sales-site-visits',
    'page-sales-offers': 'sales-offers',
    'page-sales-agreements': 'sales-agreements',
    'page-sales-payment-plans': 'sales-payment-plans',
    'page-sales-title-transfer': 'sales-title-transfer',
    'page-crm-clients': 'crm-clients',
    'page-crm-leads': 'crm-leads',
    'page-crm-pipeline': 'crm-pipeline',
    'page-crm-communication': 'crm-communication',
    'page-crm-segments': 'crm-segments',
    'page-crm-referrals': 'crm-referrals',
    'page-marketing-promotions': 'marketing-promotions',
    'page-marketing-campaigns': 'marketing-campaigns',
    'page-marketing-website-sync': 'marketing-website-sync',
    'page-marketing-social': 'marketing-social',
    'page-marketing-sources': 'marketing-sources',
    'page-vendors': 'vendors',
    'page-vendor-contracts': 'vendor-contracts',
    'page-vendor-work-orders': 'vendor-work-orders',
    'page-vendor-payments': 'vendor-payments',
    'page-comm-emails': 'comm-emails',
    'page-comm-sms': 'comm-sms',
    'page-comm-templates': 'comm-templates',
    'page-comm-history': 'comm-history',
    'page-analytics-property': 'analytics-property',
    'page-settings-templates': 'settings-templates',
    'page-notice-everyone': 'notice-everyone',
    'page-notice-tenants': 'notice-tenants',
    'page-construction-tasks': 'construction-tasks',
    'page-construction-materials': 'construction-materials',
    'page-construction-projects': 'construction-projects',
    'page-construction-contractors': 'construction-contractors',
    'page-departments': 'departments',
  };

  Object.entries(pageMap).forEach(([pageId, configKey]) => {
    const pageEl = document.getElementById(pageId);
    if (!pageEl) return;

    // Find all eye buttons and "View Details" text buttons in this page
    const eyeButtons = pageEl.querySelectorAll('button .bi-eye, button[title="View"] .bi-eye');
    eyeButtons.forEach(eyeIcon => {
      const btn = eyeIcon.closest('button');
      if (!btn) return;
      // Remove existing onclick to override with our handler
      btn.removeAttribute('onclick');

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = btn.closest('tr');
        const data = row ? extractRowData(row) : {};
        openDetailOffcanvas(configKey, data);
      });
    });

    // Also catch "View Details" text buttons
    const viewDetailsButtons = pageEl.querySelectorAll('button');
    viewDetailsButtons.forEach(btn => {
      const text = btn.textContent.trim().toLowerCase();
      if (text === 'view details' || text === 'view tour' || text === 'view matches') {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const row = btn.closest('tr');
          const data = row ? extractRowData(row) : {};
          openDetailOffcanvas(configKey, data);
        });
      }
    });
  });
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Delay to ensure all pages are rendered
  setTimeout(() => {
    initDetailButtons();
    // Make overlay click close the detail panel too
    const overlay = document.getElementById('offcanvasOverlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        closeDetailOffcanvas();
      });
    }
  }, 100);
});

// Export to global scope
window.DomiaApp = window.DomiaApp || {};
window.DomiaApp.openDetailOffcanvas = openDetailOffcanvas;
window.DomiaApp.closeDetailOffcanvas = closeDetailOffcanvas;
