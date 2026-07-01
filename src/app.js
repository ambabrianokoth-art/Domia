/**
 * Domia Ventures LTD - Property Management System
 * Main Application JavaScript
 */

// ============================================
// Global State
// ============================================
const state = {
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  notificationsOpen: false,
  mobileSearchOpen: false,
  charts: {}
};

// ============================================
// DOM Elements
// ============================================
const elements = {
  sidebar: document.getElementById('sidebar'),
  sidebarToggle: document.getElementById('sidebarToggle'),
  mainContent: document.getElementById('mainContent'),
  mobileMenuToggle: document.getElementById('mobileMenuToggle'),
  breadcrumb: document.getElementById('breadcrumb'),
  globalSearch: document.getElementById('globalSearch'),
  globalSearchResults: document.getElementById('globalSearchResults'),
  notificationsBtn: document.getElementById('notificationsBtn'),
  notificationsPanel: document.getElementById('notificationsPanel'),
  pageContent: document.getElementById('pageContent'),
  mobileSearchToggle: document.getElementById('mobileSearchToggle'),
  searchContainer: document.getElementById('searchContainer')
};

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initPageNavigation();
  initCharts();
  initGlobalSearch();
  initNotifications();
  initQuickActions();
  initSubmenus();
  initResponsive();
  initExportButtons();
  initThemeToggle();
  initMobileSearch();

  // Show dashboard by default
  navigateTo('dashboard');
});

// ============================================
// Theme Toggle Functions
// ============================================
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      // Update charts if they exist
      updateChartSizes();
    });
  }
}

// ============================================
// Mobile Search Functions
// ============================================
function initMobileSearch() {
  if (elements.mobileSearchToggle && elements.searchContainer) {
    elements.mobileSearchToggle.addEventListener('click', () => {
      elements.searchContainer.classList.toggle('mobile-open');
      if (elements.searchContainer.classList.contains('mobile-open')) {
        elements.globalSearch?.focus();
      }
    });
  }
}

// ============================================
// Sidebar Functions
// ============================================
function initSidebar() {
  // Sidebar toggle (collapse/expand) - main content button
  const sidebarToggleMain = document.getElementById('sidebarToggleMain');
  if (sidebarToggleMain) {
    sidebarToggleMain.addEventListener('click', () => {
      elements.sidebar.classList.toggle('collapsed');
      state.sidebarCollapsed = elements.sidebar.classList.contains('collapsed');
      updateChartSizes();
    });
  }

  // Legacy sidebar toggle (if exists)
  if (elements.sidebarToggle) {
    elements.sidebarToggle.addEventListener('click', () => {
      elements.sidebar.classList.toggle('collapsed');
      state.sidebarCollapsed = elements.sidebar.classList.contains('collapsed');
      updateChartSizes();
    });
  }

  // Mobile menu toggle
  if (elements.mobileMenuToggle) {
    elements.mobileMenuToggle.addEventListener('click', () => {
      elements.sidebar.classList.toggle('mobile-open');
      state.mobileMenuOpen = elements.sidebar.classList.contains('mobile-open');
      toggleOverlay();
    });
  }
}

function toggleOverlay() {
  let overlay = document.querySelector('.sidebar-overlay');

  if (state.mobileMenuOpen || state.notificationsOpen) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', () => {
        elements.sidebar.classList.remove('mobile-open');
        elements.notificationsPanel?.classList.remove('open');
        state.mobileMenuOpen = false;
        state.notificationsOpen = false;
        overlay.remove();
      });
    }
    setTimeout(() => overlay.classList.add('show'), 10);
  } else {
    overlay?.classList.remove('show');
    setTimeout(() => overlay?.remove(), 300);
  }
}

// ============================================
// Offcanvas Functions
// ============================================
function openOffcanvas(panelId) {
  const panel = document.getElementById(panelId);
  const overlay = document.getElementById('offcanvasOverlay');

  if (panel) {
    panel.classList.add('open');
    overlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeOffcanvas(panelId) {
  const panel = document.getElementById(panelId);
  const overlay = document.getElementById('offcanvasOverlay');

  if (panel) {
    panel.classList.remove('open');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Make functions globally accessible - assigned via module load event
// All these are function declarations so they are hoisted and available here
window.DomiaApp = {
  navigateTo: navigateTo,
  state: state,
  openOffcanvas: openOffcanvas,
  closeOffcanvas: closeOffcanvas,
  showToast: showToast,
  openModal: openModal,
  closeModal: closeModal,
  resetForm: resetForm,
  validateForm: validateForm,
  exportTable: exportTable,
  sortTable: sortTable,
  filterTable: filterTable,
  paginateTable: paginateTable
};

// ============================================
// Submenu Functions
// ============================================
function initSubmenus() {
  const submenuItems = document.querySelectorAll('.nav-item.has-submenu');

  submenuItems.forEach(item => {
    const link = item.querySelector(':scope > .nav-link');

    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Close other submenus at same level
      const siblings = item.parentElement.querySelectorAll(':scope > .nav-item.has-submenu');
      siblings.forEach(sibling => {
        if (sibling !== item) {
          sibling.classList.remove('open');
        }
      });

      // Toggle current submenu
      item.classList.toggle('open');

      // If sidebar is collapsed, expand it
      if (state.sidebarCollapsed) {
        elements.sidebar.classList.remove('collapsed');
        state.sidebarCollapsed = false;
      }
    });
  });

  // Handle nested submenus
  const nestedSubmenuItems = document.querySelectorAll('.has-submenu > .submenu-level-2');
}

// ============================================
// Page Navigation
// ============================================
function initPageNavigation() {
  // Handle nav links with data-page attribute
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page) {
        navigateTo(page);
      }
    });
  });
}

function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });

  // Show selected page
  const pageElement = document.getElementById(`page-${page}`);
  if (pageElement) {
    pageElement.classList.add('active');
    state.currentPage = page;
    updateBreadcrumb(page);
    updateActiveNavLink(page);

    // Close mobile menu
    elements.sidebar.classList.remove('mobile-open');
    state.mobileMenuOpen = false;
    document.querySelector('.sidebar-overlay')?.remove();

    // Close any open offcanvas panels
    document.querySelectorAll('.offcanvas-panel.open').forEach(panel => {
      panel.classList.remove('open');
    });
    document.getElementById('offcanvasOverlay')?.classList.remove('show');

    // Update charts if navigating to dashboard
    if (page === 'dashboard') {
      setTimeout(updateChartSizes, 100);
    }

    // Lazy-init report page charts
    if (page === 'report-pnl') setTimeout(initPnLCharts, 100);
    if (page === 'report-property') setTimeout(initPropertyReportCharts, 100);
    if (page === 'report-unit') setTimeout(initUnitReportCharts, 100);
    if (page === 'report-tenant-history') setTimeout(initTenantHistoryCharts, 100);
  }
}

function updateBreadcrumb(page) {
  if (!elements.breadcrumb) return;

  const pageNames = {
    'dashboard': 'Dashboard',
    'users': 'Users',
    'roles': 'Roles',
    'login-history': 'Logged History',
    'tenants': 'Tenants',
    'maintainers': 'Maintainers',
    'properties': 'Properties',
    'units': 'Units',
    'maintenance-all': 'All Maintenance Requests',
    'maintenance-pending': 'Pending Maintenance',
    'maintenance-progress': 'In Progress Maintenance',
    'maintenance-done': 'Completed Maintenance',
    'invoices': 'Invoices',
    'expenses': 'Expenses',
    'overdue-rent': 'Overdue Rent',
    'calendar': 'Calendar',
    'agreements': 'Agreements',
    'contact-diary': 'Contact Diary',
    'notice-board': 'Notice Board',
    'n8n': 'N8N Workflows',
    'report-income': 'Income Report',
    'report-expense': 'Expense Report',
    'report-pnl': 'Profit & Loss',
    'report-property': 'Property Report',
    'report-unit': 'Unit Report',
    'report-tenant-history': 'Tenant History',
    'report-maintenance': 'Maintenance Report',
    'owners': 'Property Owners',
    'owner-detail': 'Owner Details',
    'logged-history': 'Logged History',
    'analytics-all': 'All Property Analytics',
    'analytics-property': 'Property Analytics',
    'analytics-revenue': 'Property Revenue Analytics',
    'notice-everyone': 'Notice Board - Everyone',
    'notice-tenants': 'Notice Board - Tenants',
    'notice-managers': 'Notice Board - Managers',
    'property-list': 'All Properties',
    'property-availability': 'Property Availability',
    'property-analytics': 'Property Analytics',
    'sales-leads': 'Sales Leads',
    'sales-pipeline': 'Sales Pipeline',
    'sales-commissions': 'Sales Commissions',
    'construction-projects': 'Construction Projects',
    'construction-tasks': 'Construction Tasks',
    'construction-materials': 'Construction Materials',
    'construction-contractors': 'Contractors',
    'bnb-bookings': 'BnB Bookings',
    'bnb-guests': 'BnB Guests',
    'bnb-calendar': 'BnB Calendar',
    'bnb-reviews': 'BnB Reviews',
    'hunting-requests': 'House Hunting Requests',
    'hunting-matches': 'Property Matches',
    'hunting-tours': 'Property Tours',
    'comm-reminders': 'Reminders',
    'comm-notifications': 'Notifications',
    'comm-emails': 'Email Communications',
    'comm-sms': 'SMS Communications',
    'comm-templates': 'Message Templates',
    'comm-history': 'Communication History',
    'documents': 'Documents',
    'settings-general': 'General Settings',
    'settings-company': 'Company Settings',
    'settings-payment': 'Payment Gateway',
    'settings-integrations': 'Integrations',
    'settings-notifications': 'Notification Settings',
    'settings-templates': 'Templates',
    'account-profile': 'My Profile',
    'account-password': 'Password',
    'account-2fa': 'Two-Factor Auth',
    'profile': 'Profile',
    'settings-preferences': 'Preferences',
    // Detail Pages
    'tenant-detail': 'Tenant Details',
    'tenant-create': 'Add New Tenant',
    'tenant-edit': 'Edit Tenant',
    'property-detail': 'Property Details',
    'property-create': 'Add New Property',
    'property-edit': 'Edit Property',
    'unit-detail': 'Unit Details',
    'unit-create': 'Add New Unit',
    'unit-edit': 'Edit Unit',
    'user-detail': 'User Details',
    'user-create': 'Add New User',
    'user-edit': 'Edit User',
    'maintainer-detail': 'Maintainer Details',
    'owner-detail': 'Owner Details',
    'agreement-detail': 'Agreement Details',
    'booking-detail': 'Booking Details',
    'guest-detail': 'Guest Details',
    // Staff Management Pages
    'departments': 'Departments & Teams',
    'staff-attendance': 'Staff Attendance',
    'staff-performance': 'Staff Performance',
    'payroll': 'Payroll',
    'staff-commissions': 'Staff Commissions',
    'activity-logs': 'Activity Logs',
    // Property Management Pages
    'property-categories': 'Property Categories',
    'property-documents': 'Property Documents',
    'property-inspections': 'Inspections',
    'property-media': 'Media Gallery',
    'property-valuations': 'Valuations',
    // Tenant Management Pages
    'tenant-payments': 'Payment Tracking',
    'tenant-arrears': 'Arrears/Defaulters',
    'tenant-deposits': 'Deposits',
    'tenant-complaints': 'Complaints',
    'tenant-evictions': 'Evictions',
    'lease-renewals': 'Lease Renewals',
    // BnB Management Pages
    'bnb-listings': 'BnB Listings',
    'bnb-pricing': 'Pricing Plans',
    'bnb-checkin': 'Check-in/out',
    'bnb-channel': 'Channel Manager',
    'bnb-housekeeping': 'Housekeeping',
    'bnb-cancellations': 'Cancellations',
    // House Hunting Pages
    'hunting-agent-assignment': 'Agent Assignment',
    'hunting-feedback': 'Client Feedback',
    'hunting-fees': 'Service Fees',
    // Sales & Leasing Pages
    'sales-listings': 'Sales Listings',
    'sales-site-visits': 'Site Visits',
    'sales-offers': 'Offers & Negotiations',
    'sales-agreements': 'Sales Agreements',
    'sales-payment-plans': 'Payment Plans',
    'sales-title-transfer': 'Title Transfer',
    // CRM Pages
    'crm-clients': 'All Clients',
    'crm-leads': 'Leads Management',
    'crm-pipeline': 'Sales Pipeline',
    'crm-communication': 'Communication History',
    'crm-segments': 'Segmentation',
    'crm-referrals': 'Referrals',
    // Marketing Pages
    'marketing-promotions': 'Promotions',
    'marketing-campaigns': 'Campaigns',
    'marketing-website-sync': 'Website Sync',
    'marketing-social': 'Social Media',
    'marketing-sources': 'Lead Sources',
    // Vendors Pages
    'vendors': 'Vendors',
    'vendor-contracts': 'Service Contracts',
    'vendor-work-orders': 'Work Orders',
    'vendor-payments': 'Vendor Payments',
    // Detail Pages
    'department-detail': 'Department Details',
    'inspection-detail': 'Inspection Details',
    'payment-detail': 'Payment Details',
    'client-detail': 'Client Details',
    'lead-detail': 'Lead Details',
    'vendor-detail': 'Vendor Details',
    'workorder-detail': 'Work Order Details'
  };

  const pageName = pageNames[page] || page;
  elements.breadcrumb.innerHTML = `
    <li class="breadcrumb-item"><a href="#" data-page="dashboard">Home</a></li>
    <li class="breadcrumb-item active">${pageName}</li>
  `;
}

function updateActiveNavLink(page) {
  // Remove active from ALL nav links and submenu links
  document.querySelectorAll('.nav-link, .submenu a, .submenu li a').forEach(link => {
    link.classList.remove('active');
  });

  // Add active to matching link
  const activeLink = document.querySelector(`[data-page="${page}"]`);
  if (activeLink) {
    activeLink.classList.add('active');

    // Open parent submenu if exists
    const parentSubmenu = activeLink.closest('.nav-item.has-submenu');
    if (parentSubmenu) {
      parentSubmenu.classList.add('open');
    }

    const nestedParent = activeLink.closest('li.has-submenu');
    if (nestedParent) {
      nestedParent.classList.add('open');
    }
  }
}

// ============================================
// Global Search
// ============================================
function initGlobalSearch() {
  if (!elements.globalSearch || !elements.globalSearchResults) return;

  let debounceTimer;

  elements.globalSearch.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (query.length < 2) {
      elements.globalSearchResults.classList.remove('show');
      return;
    }

    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);
  });

  // Close search results on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      elements.globalSearchResults.classList.remove('show');
    }
  });
}

function performSearch(query) {
  // Mock search results - in production this would call Supabase API
  const mockResults = [
    { type: 'Property', name: 'Sunrise Apartments', id: 'prop-001' },
    { type: 'Unit', name: 'Unit 204 - Sunrise Apartments', id: 'unit-204' },
    { type: 'Tenant', name: 'John Smith', id: 'tenant-123' },
    { type: 'Invoice', name: 'INV-2024-001', id: 'inv-001' }
  ].filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  displaySearchResults(mockResults);
}

function displaySearchResults(results) {
  if (results.length === 0) {
    elements.globalSearchResults.innerHTML = `
      <div class="search-result-item">
        <div class="result-type">No results found</div>
      </div>
    `;
  } else {
    elements.globalSearchResults.innerHTML = results.map(result => `
      <div class="search-result-item" data-type="${result.type.toLowerCase()}" data-id="${result.id}">
        <div class="result-type">${result.type}</div>
        <div class="result-name">${result.name}</div>
      </div>
    `).join('');
  }

  elements.globalSearchResults.classList.add('show');
}

// ============================================
// Notifications Panel
// ============================================
function initNotifications() {
  if (elements.notificationsBtn && elements.notificationsPanel) {
    elements.notificationsBtn.addEventListener('click', () => {
      elements.notificationsPanel.classList.toggle('open');
      state.notificationsOpen = elements.notificationsPanel.classList.contains('open');
      toggleOverlay();
    });
  }
}

// ============================================
// Charts Initialization
// ============================================
function initCharts() {
  initRevenueChart();
  initOccupancyChart();
}

function initRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Gradient for chart
  const gradient = ctx.createLinearGradient(0, 0, 0, 250);
  gradient.addColorStop(0, 'rgba(159, 207, 103, 0.4)');
  gradient.addColorStop(1, 'rgba(159, 207, 103, 0.0)');

  state.charts.revenue = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue',
        data: [185000, 192000, 198000, 215000, 228000, 235000, 248000, 252000, 268000, 275000, 280000, 284500],
        borderColor: '#9fcf67',
        backgroundColor: gradient,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#9fcf67',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#212529',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return '$' + context.parsed.y.toLocaleString();
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 10 },
            color: '#6c757d'
          }
        },
        y: {
          grid: {
            color: 'rgba(0,0,0,0.05)',
            drawBorder: false
          },
          ticks: {
            font: { size: 10 },
            color: '#6c757d',
            callback: function(value) {
              return '$' + (value / 1000) + 'k';
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });

  // Handle chart type buttons
  document.querySelectorAll('[data-chart="revenue-type"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-chart="revenue-type"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Update chart data based on type
      // In production, this would fetch different data
    });
  });
}

function initOccupancyChart() {
  const canvas = document.getElementById('occupancyChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  state.charts.occupancy = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Occupied', 'Reserved', 'Vacant'],
      datasets: [{
        data: [84.8, 9.2, 6],
        backgroundColor: ['#198754', '#ffc107', '#e9ecef'],
        borderWidth: 0,
        spacing: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 10 },
            color: '#495057',
            padding: 12,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: '#212529',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 10,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%';
            }
          }
        }
      }
    }
  });
}

function updateChartSizes() {
  Object.values(state.charts).forEach(chart => {
    if (chart) {
      chart.resize();
    }
  });
}

// ============================================
// Quick Actions
// ============================================
function initQuickActions() {
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.getAttribute('data-action');
      handleQuickAction(action);
    });
  });
}

function handleQuickAction(action) {
  const modalMap = {
    'add-property': 'propertyModal',
    'add-unit': 'unitModal',
    'add-tenant': 'tenantModal',
    'add-invoice': 'invoiceModal',
    'add-maintenance': 'maintenanceModal'
  };

  const modalId = modalMap[action];
  if (modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}

// ============================================
// Responsive Handling
// ============================================
function initResponsive() {
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      // Desktop: close mobile menu
      elements.sidebar.classList.remove('mobile-open');
      state.mobileMenuOpen = false;
      document.querySelector('.sidebar-overlay')?.remove();
    }
  });

  // Handle sidebar collapse state based on screen size
  if (window.innerWidth <= 1200) {
    state.sidebarCollapsed = false;
    elements.sidebar.classList.remove('collapsed');
  }
}

// ============================================
// Export Functions
// ============================================
function initExportButtons() {
  document.querySelectorAll('[data-export]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const format = btn.getAttribute('data-export');
      const tableId = btn.closest('.table-card')?.querySelector('table')?.id || 'dataTable';
      exportTable(tableId, format);
    });
  });
}

function exportTable(tableId, format) {
  const table = document.getElementById(tableId);
  if (!table) {
    console.warn('Table not found:', tableId);
    return;
  }

  const data = getTableData(table);
  const filename = `export_${new Date().toISOString().slice(0, 10)}`;

  switch (format) {
    case 'csv':
      exportToCSV(data, filename);
      break;
    case 'excel':
      exportToExcel(data, filename);
      break;
    case 'pdf':
      exportToPDF(data, filename);
      break;
  }

  showToast(`Exporting to ${format.toUpperCase()}...`, 'info');
}

function getTableData(table) {
  const rows = [];
  const headers = [];

  // Get headers
  table.querySelectorAll('thead th').forEach(th => {
    headers.push(th.textContent.trim());
  });
  rows.push(headers);

  // Get data rows
  table.querySelectorAll('tbody tr').forEach(tr => {
    const rowData = [];
    tr.querySelectorAll('td').forEach(td => {
      rowData.push(td.textContent.trim());
    });
    rows.push(rowData);
  });

  return rows;
}

function exportToCSV(data, filename) {
  const csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  downloadFile(csv, `${filename}.csv`, 'text/csv');
}

function exportToExcel(data, filename) {
  // Simple CSV export with .xls extension for Excel compatibility
  const csv = data.map(row => row.map(cell => `"${cell}"`).join('\t')).join('\n');
  downloadFile(csv, `${filename}.xls`, 'application/vnd.ms-excel');
}

function exportToPDF(data, filename) {
  // For PDF export, we'll create a printable HTML table
  const html = `
    <html>
    <head>
      <title>${filename}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background: #f5f5f5; font-weight: bold; }
      </style>
    </head>
    <body>
      <table>
        ${data.map((row, i) => `
          <tr>${row.map(cell => i === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`).join('')}</tr>
        `).join('')}
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
  }

  const toastId = 'toast-' + Date.now();
  const bgClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : type === 'warning' ? 'bg-warning' : 'bg-info';

  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', toastHTML);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();

  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
}

// ============================================
// Calendar Functions
// ============================================
function initCalendar() {
  const calendarEl = document.getElementById('calendarGrid');
  if (!calendarEl) return;

  const today = new Date();
  renderCalendar(today.getFullYear(), today.getMonth());
}

function renderCalendar(year, month) {
  const calendarEl = document.getElementById('calendarGrid');
  if (!calendarEl) return;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Update calendar title
  const titleEl = document.querySelector('.calendar-title');
  if (titleEl) {
    titleEl.textContent = `${months[month]} ${year}`;
  }

  // Build calendar grid
  let html = '';

  // Day headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(day => {
    html += `<div class="calendar-day-header">${day}</div>`;
  });

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    html += `<div class="calendar-day other-month"><div class="calendar-day-number">${prevMonthLastDay - i}</div></div>`;
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const isToday = date.getTime() === today.getTime();
    const dayClass = isToday ? 'calendar-day today' : 'calendar-day';

    html += `<div class="${dayClass}" data-date="${year}-${month + 1}-${day}">
      <div class="calendar-day-number">${day}</div>
      <div class="calendar-events"></div>
    </div>`;
  }

  // Next month days
  const remainingDays = 42 - (startDay + totalDays);
  for (let day = 1; day <= remainingDays; day++) {
    html += `<div class="calendar-day other-month"><div class="calendar-day-number">${day}</div></div>`;
  }

  calendarEl.innerHTML = html;
}

// ============================================
// Form Helpers
// ============================================
function resetForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
    // Clear any validation states
    form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
      el.classList.remove('is-invalid', 'is-valid');
    });
  }
}

function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  let isValid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('is-invalid');
      isValid = false;
    } else {
      field.classList.remove('is-invalid');
    }
  });

  return isValid;
}

// ============================================
// Data Table Functions
// ============================================
function sortTable(tableId, columnIndex, type = 'string') {
  const table = document.getElementById(tableId);
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const aCell = a.cells[columnIndex].textContent.trim();
    const bCell = b.cells[columnIndex].textContent.trim();

    if (type === 'number') {
      return parseFloat(aCell) - parseFloat(bCell);
    } else if (type === 'date') {
      return new Date(aCell) - new Date(bCell);
    } else {
      return aCell.localeCompare(bCell);
    }
  });

  rows.forEach(row => tbody.appendChild(row));
}

function filterTable(tableId, searchValue) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const search = searchValue.toLowerCase();
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(search) ? '' : 'none';
  });
}

function paginateTable(tableId, page, rowsPerPage = 10) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  const start = page * rowsPerPage;
  const end = start + rowsPerPage;

  rows.forEach((row, index) => {
    row.style.display = (index >= start && index < end) ? '' : 'none';
  });
}

// ============================================
// Modal Helpers
// ============================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) {
      bsModal.hide();
    }
  }
}

// ============================================
// Dashboard Refresh
// ============================================
document.getElementById('dashboardRefresh')?.addEventListener('click', () => {
  showToast('Refreshing dashboard data...', 'info');
  // In production, this would fetch fresh data from Supabase
  setTimeout(() => {
    showToast('Dashboard updated', 'success');
  }, 1000);
});

document.getElementById('dashboardDateRange')?.addEventListener('change', (e) => {
  showToast(`Showing data for: ${e.target.value}`, 'info');
  // In production, this would filter/re-fetch data based on date range
});

// ============================================
// Logout Handler
// ============================================
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  showToast('Logging out...', 'info');
  // In production, this would handle Supabase auth logout
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 500);
});

// ============================================
// Report Page Charts
// ============================================
const CHART_COLORS = {
  primary: '#F25022',
  blue: '#4a90d9',
  teal: '#0d9488',
  green: '#16a34a',
  yellow: '#d97706',
  purple: '#BBAACC',
  red: '#dc2626',
  orange: '#ea580c',
  grid: 'rgba(255,255,255,0.06)',
  text: '#6c757d'
};

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#adb5bd', font: { size: 11 } } },
    tooltip: { backgroundColor: '#2B3E4B', titleColor: '#fff', bodyColor: '#fff', padding: 10 }
  }
};

function initPnLCharts() {
  if (state.charts.pnlTrend) return;

  const trendCtx = document.getElementById('pnlTrendChart');
  if (trendCtx) {
    state.charts.pnlTrend = new Chart(trendCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Revenue', data: [26.2, 25.7, 26.7, 26.1, 26.9, 26.4], backgroundColor: 'rgba(22,163,74,0.7)', borderRadius: 4 },
          { label: 'Expenses', data: [3.96, 3.89, 3.95, 4.01, 3.99, 3.98], backgroundColor: 'rgba(220,38,38,0.7)', borderRadius: 4 },
          { label: 'NOI', type: 'line', data: [22.3, 21.8, 22.7, 22.1, 22.9, 22.5], borderColor: CHART_COLORS.primary, backgroundColor: 'transparent', pointRadius: 4, tension: 0.3, borderWidth: 2 }
        ]
      },
      options: { ...CHART_DEFAULTS, scales: {
        x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 } } },
        y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 }, callback: v => 'Ksh ' + v + 'M' } }
      }}
    });
  }

  const pieCtx = document.getElementById('pnlRevenuePie');
  if (pieCtx) {
    state.charts.pnlPie = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Residential Rent', 'Commercial Rent', 'Parking', 'Late Fees', 'Service Charges', 'Other'],
        datasets: [{ data: [62.4, 26.8, 5.2, 2.1, 2.2, 1.3], backgroundColor: [CHART_COLORS.blue, CHART_COLORS.teal, CHART_COLORS.green, CHART_COLORS.yellow, CHART_COLORS.purple, CHART_COLORS.text], borderWidth: 0, hoverOffset: 6 }]
      },
      options: { ...CHART_DEFAULTS, cutout: '65%' }
    });
  }
}

function initPropertyReportCharts() {
  if (state.charts.propertyDist) return;

  const distCtx = document.getElementById('propertyDistributionChart');
  if (distCtx) {
    state.charts.propertyDist = new Chart(distCtx, {
      type: 'pie',
      data: {
        labels: ['Green Valley', 'Downtown Plaza', 'Westlands Heights', 'Kilimani Gardens', 'Parklands', 'Lavington Court'],
        datasets: [{ data: [120, 85, 64, 45, 38, 52], backgroundColor: [CHART_COLORS.blue, CHART_COLORS.teal, CHART_COLORS.green, CHART_COLORS.primary, CHART_COLORS.yellow, CHART_COLORS.purple], borderWidth: 0 }]
      },
      options: { ...CHART_DEFAULTS }
    });
  }

  const occCtx = document.getElementById('propertyOccupancyChart');
  if (occCtx) {
    state.charts.propertyOcc = new Chart(occCtx, {
      type: 'bar',
      data: {
        labels: ['Green Valley', 'Downtown Plaza', 'Westlands', 'Kilimani', 'Parklands', 'Lavington'],
        datasets: [
          { label: 'Occupied', data: [112, 79, 60, 40, 36, 47], backgroundColor: 'rgba(22,163,74,0.8)', borderRadius: 4 },
          { label: 'Vacant', data: [8, 6, 4, 5, 2, 5], backgroundColor: 'rgba(217,119,6,0.8)', borderRadius: 4 }
        ]
      },
      options: { ...CHART_DEFAULTS, scales: {
        x: { stacked: true, grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 } } },
        y: { stacked: true, grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 } } }
      }}
    });
  }

  const trendCtx = document.getElementById('propertyTrendChart');
  if (trendCtx) {
    state.charts.propertyTrend = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Revenue (M)', data: [112.4, 118.6, 121.3, 125.8, 128.4, 131.2, 134.5, 130.2, 138.7, 135.4, 140.2, 139.8], borderColor: CHART_COLORS.green, tension: 0.4, borderWidth: 2, pointRadius: 3, fill: false },
          { label: 'Occupancy %', data: [91, 92, 93, 93, 94, 94, 95, 94, 95, 93, 95, 94.9], borderColor: CHART_COLORS.blue, tension: 0.4, borderWidth: 2, pointRadius: 3, fill: false, yAxisID: 'y2' }
        ]
      },
      options: { ...CHART_DEFAULTS, scales: {
        x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 } } },
        y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 }, callback: v => 'Ksh ' + v + 'M' } },
        y2: { position: 'right', grid: { display: false }, ticks: { color: CHART_COLORS.text, font: { size: 10 }, callback: v => v + '%' } }
      }}
    });
  }
}

function initUnitReportCharts() {
  if (state.charts.unitStatus) return;

  const statusCtx = document.getElementById('unitStatusChart');
  if (statusCtx) {
    state.charts.unitStatus = new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: ['Occupied', 'Vacant', 'Under Maintenance'],
        datasets: [{ data: [847, 38, 7], backgroundColor: [CHART_COLORS.green, CHART_COLORS.yellow, CHART_COLORS.red], borderWidth: 0, hoverOffset: 6 }]
      },
      options: { ...CHART_DEFAULTS, cutout: '65%' }
    });
  }

  const revCtx = document.getElementById('unitRevenueChart');
  if (revCtx) {
    state.charts.unitRevenue = new Chart(revCtx, {
      type: 'bar',
      data: {
        labels: ['Studio', '1BR', '2BR', '3BR', '4BR+', 'Commercial'],
        datasets: [{ label: 'Avg Monthly Rent (Ksh)', data: [65000, 98000, 145000, 220000, 350000, 280000], backgroundColor: [CHART_COLORS.blue, CHART_COLORS.teal, CHART_COLORS.green, CHART_COLORS.primary, CHART_COLORS.yellow, CHART_COLORS.purple], borderRadius: 4 }]
      },
      options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } }, scales: {
        x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 } } },
        y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 }, callback: v => 'Ksh ' + (v/1000) + 'k' } }
      }}
    });
  }

  const trendCtx = document.getElementById('unitOccupancyTrendChart');
  if (trendCtx) {
    state.charts.unitTrend = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Total Units', data: [892, 892, 892, 895, 895, 892], borderColor: CHART_COLORS.text, borderDash: [5, 5], tension: 0, borderWidth: 1.5, pointRadius: 0, fill: false },
          { label: 'Occupied', data: [845, 842, 850, 851, 854, 847], borderColor: CHART_COLORS.green, tension: 0.3, borderWidth: 2, pointRadius: 3, fill: false }
        ]
      },
      options: { ...CHART_DEFAULTS, scales: {
        x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 } } },
        y: { grid: { color: CHART_COLORS.grid }, min: 820, ticks: { color: CHART_COLORS.text, font: { size: 10 } } }
      }}
    });
  }
}

function initTenantHistoryCharts() {
  if (state.charts.tenantDist) return;

  const distCtx = document.getElementById('tenantDistributionChart');
  if (distCtx) {
    state.charts.tenantDist = new Chart(distCtx, {
      type: 'pie',
      data: {
        labels: ['Green Valley', 'Downtown Plaza', 'Westlands Heights', 'Kilimani Gardens', 'Parklands', 'Lavington Court'],
        datasets: [{ data: [112, 79, 60, 40, 36, 47], backgroundColor: [CHART_COLORS.blue, CHART_COLORS.teal, CHART_COLORS.green, CHART_COLORS.primary, CHART_COLORS.yellow, CHART_COLORS.purple], borderWidth: 0 }]
      },
      options: { ...CHART_DEFAULTS }
    });
  }

  const scoreCtx = document.getElementById('tenantPaymentScoreChart');
  if (scoreCtx) {
    state.charts.tenantScore = new Chart(scoreCtx, {
      type: 'bar',
      data: {
        labels: ['100%', '95-99%', '90-94%', '80-89%', '70-79%', 'Below 70%'],
        datasets: [{ label: 'Tenants', data: [124, 189, 142, 56, 18, 5], backgroundColor: [CHART_COLORS.green, CHART_COLORS.teal, CHART_COLORS.blue, CHART_COLORS.yellow, CHART_COLORS.orange, CHART_COLORS.red], borderRadius: 4 }]
      },
      options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } }, scales: {
        x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 } } },
        y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 } } }
      }}
    });
  }

  const collectionCtx = document.getElementById('tenantCollectionChart');
  if (collectionCtx) {
    state.charts.tenantCollection = new Chart(collectionCtx, {
      type: 'bar',
      data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Collected (M)', data: [118.4, 121.2, 124.5, 126.8, 128.9, 131.2, 134.5, 130.2, 138.7, 135.4, 140.2, 139.8], backgroundColor: 'rgba(22,163,74,0.7)', borderRadius: 4 },
          { label: 'Outstanding (M)', data: [5.2, 4.8, 6.1, 5.5, 4.9, 6.2, 7.1, 8.4, 5.8, 9.2, 7.6, 12.8], backgroundColor: 'rgba(220,38,38,0.7)', borderRadius: 4 }
        ]
      },
      options: { ...CHART_DEFAULTS, scales: {
        x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 } } },
        y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 }, callback: v => 'Ksh ' + v + 'M' } }
      }}
    });
  }
}

// ============================================
// Initialize on page load
// ============================================
window.addEventListener('load', () => {
  // Initialize tooltips
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltips.forEach(el => new bootstrap.Tooltip(el));

  // Initialize popovers
  const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
  popovers.forEach(el => new bootstrap.Popover(el));
});
