<template>
  <div class="home-page">
    <nav class="home-navbar">
      <div class="container-fluid" style="max-width: 92%;">
        <div class="nav-content">
          <div class="nav-brand">
            <div class="brand-icon"></div>
            <h1 style="font-size: 27px;">Cytonn System</h1>
          </div>
          <div class="nav-actions">
            <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn btn-outline">
              Sign In
            </router-link>
            <router-link v-if="!authStore.isAuthenticated" to="/signup" class="btn btn-primary">
              Get Started
            </router-link>
            <div v-if="authStore.isAuthenticated" class="user-menu">
              <div class="user-info">
                <div class="user-avatar">{{ userInitials }}</div>
                <span class="user-name">{{ authStore.user?.name }}</span>
              </div>
              <router-link 
                :to="authStore.isAdmin ? '/admin' : '/dashboard'" 
                class="btn btn-primary"
              >
                Dashboard
              </router-link>
              <button @click="handleLogout" class="btn btn-outline">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="hero-section">
      <div class="container-fluid">
        <div class="hero-content">
          <div class="hero-badge">
            <span>✨ Streamline Your Workflow</span>
          </div>
          <h2 class="hero-title">
            Manage Tasks with 
            <span class="gradient-text">Precision</span>
          </h2>
          <p class="hero-description">
            Empower your team with intelligent task management. Assign, track, and complete 
            projects with real-time collaboration and automated notifications.
          </p>
          
          <div class="hero-actions">
            <router-link 
              v-if="!authStore.isAuthenticated" 
              to="/signup" 
              class="btn btn-primary btn-large"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
              Start Today
            </router-link>
            <router-link 
              v-if="authStore.isAuthenticated"
              :to="authStore.isAdmin ? '/admin' : '/dashboard'" 
              class="btn btn-primary btn-large"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Go to Dashboard
            </router-link>
            <button class="btn btn-outline btn-large demo-btn" @click="showDemo = true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5,3 19,12 5,21"></polygon>
              </svg>
              Watch Demo
            </button>
          </div>

          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">10K+</div>
              <div class="stat-label">Active Users</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50K+</div>
              <div class="stat-label">Tasks Completed</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">Uptime</div>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="dashboard-preview">
            <div class="preview-header">
              <div class="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="preview-title">Dashboard</div>
            </div>
            <div class="preview-content">
              <div class="preview-sidebar">
                <div class="sidebar-item active">📊 Dashboard</div>
                <div class="sidebar-item">📋 My Tasks</div>
                <div class="sidebar-item">👥 Team</div>
              </div>
              <div class="preview-main">
                <div class="task-card">
                  <div class="task-status pending"></div>
                  <div class="task-info">
                    <div class="task-title">Design Homepage</div>
                    <div class="task-meta">Due: Today</div>
                  </div>
                </div>
                <div class="task-card">
                  <div class="task-status progress"></div>
                  <div class="task-info">
                    <div class="task-title">API Integration</div>
                    <div class="task-meta">Due: Tomorrow</div>
                  </div>
                </div>
                <div class="task-card">
                  <div class="task-status completed"></div>
                  <div class="task-info">
                    <div class="task-title">User Testing</div>
                    <div class="task-meta">Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>Everything you need to succeed</h2>
          <p>Powerful features designed for modern teams</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon" v-html="feature.icon"></div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <div class="feature-highlight">{{ feature.highlight }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2>Trusted by teams worldwide</h2>
          <p>See what our users are saying</p>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
            <div class="testimonial-content">
              <p>"{{ testimonial.content }}"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">{{ testimonial.initials }}</div>
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-role">{{ testimonial.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to transform your workflow?</h2>
          <p>Join thousands of teams already using This to achieve more</p>
          <div class="cta-actions">
            <router-link v-if="!authStore.isAuthenticated" to="/signup" class="btn btn-primary btn-large">
              Start Your Free Trial
            </router-link>
            <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn btn-outline btn-large">
              Sign In
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>Cytonn Management System</h3>
            <p>Streamline your workflow with intelligent task management</p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
            </div>
            <div class="link-group">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
            </div>
            <div class="link-group">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 Cytonn Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Demo Modal -->
    <div v-if="showDemo" class="modal-overlay" @click="showDemo = false">
      <div class="demo-modal" @click.stop>
        <div class="demo-header">
          <h3>System Demo</h3>
          <button @click="showDemo = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="demo-content">
          <div class="demo-placeholder">
            <div class="play-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5,3 19,12 5,21"></polygon>
              </svg>
            </div>
            <p>I'll embedd a Demo video here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showDemo = ref(false)

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const features = [
  {
    icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11H1v3h8v3l3-4-3-4v2z"></path><path d="M22 12h-7"></path></svg>',
    title: 'Smart Task Assignment',
    description: 'Intelligently assign tasks based on team capacity and expertise',
    highlight: 'AI-Powered'
  },
  {
    icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>',
    title: 'Real-time Collaboration',
    description: 'Stay synchronized with instant updates and live notifications',
    highlight: 'Live Updates'
  },
  {
    icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
    title: 'Email Integration',
    description: 'Automated notifications and seamless email workflow integration',
    highlight: 'Automated'
  },
  {
    icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v6m0 6v6m6-12h-6m-6 0h6"></path></svg>',
    title: 'Mobile Ready',
    description: 'Access your tasks anywhere with our responsive mobile interface',
    highlight: 'Cross-Platform'
  }
]

const testimonials = [
  {
    content: 'This system transformed how our team collaborates. The real-time updates and smart notifications keep everyone aligned.',
    name: 'Amba Brian',
    role: 'Software Engineer',
    initials: 'Mr'
  },
  {
    content: 'The analytics dashboard gives us incredible insights into our productivity. We\'ve improved efficiency by 40%.',
    name: 'Ben Kirui',
    role: 'Social Media marketer',
    initials: 'Mr'
  },
  {
    content: 'Simple, intuitive, and powerful. This system is exactly what we needed to scale our operations.',
    name: 'Mark Munialo',
    role: 'Operations Director',
    initials: 'Mr'
  }
]

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fafafa 0%, #f3f2f1 100%);
}

.container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Navigation */
.home-navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(225, 225, 225, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}


.nav-brand h1 {
  color: var(--ms-primary);
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  margin-left: 50px;
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ms-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
}

.user-name {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.8rem;
}

/* Hero Section */
.hero-section {
  padding: 4rem 0 6rem;
}

.hero-content {
  text-align: center;
  margin-bottom: 4rem;
}

.hero-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--ms-primary), var(--ms-secondary));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--ms-dark);
  margin-bottom: 1.5rem;
  line-height: 1.2;
  animation: fadeInUp 0.6s ease 0.1s both;
}

.gradient-text {
  background: linear-gradient(135deg, var(--ms-primary), var(--ms-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  animation: fadeInUp 0.6s ease 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  animation: fadeInUp 0.6s ease 0.3s both;
}

.btn {
  padding: 0.60rem 1.9rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  min-height: 44px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--ms-primary), var(--ms-secondary));
  color: white;
  box-shadow: 0 4px 12px rgba(0, 120, 212, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 120, 212, 0.4);
}

.btn-outline {
  background: transparent;
  color: var(--ms-primary);
  border: 2px solid var(--ms-primary);
}

.btn-outline:hover {
  background: var(--ms-primary);
  color: white;
}

.btn-large {
  padding: 0.6rem 1.8rem;
  font-size: 0.9rem;
}

.hero-stats {
  display: flex;
  gap: 3rem;
  justify-content: center;
  animation: fadeInUp 0.6s ease 0.4s both;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--ms-primary);
  display: block;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

/* Hero Visual */
.hero-visual {
  display: flex;
  justify-content: center;
  animation: fadeInUp 0.8s ease 0.5s both;
}

.dashboard-preview {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 800px;
  width: 100%;
}

.preview-header {
  background: var(--ms-light);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.preview-dots {
  display: flex;
  gap: 0.5rem;
}

.preview-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
}

.preview-dots span:nth-child(1) { background: #ff5f57; }
.preview-dots span:nth-child(2) { background: #ffbd2e; }
.preview-dots span:nth-child(3) { background: #28ca42; }

.preview-title {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.8rem;
}

.preview-content {
  display: flex;
  height: 300px;
}

.preview-sidebar {
  width: 200px;
  background: #f8f9fa;
  padding: 1rem;
  border-right: 1px solid #e1e1e1;
}

.sidebar-item {
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-item.active {
  background: var(--ms-primary);
  color: white;
}

.preview-main {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.task-card:hover {
  border-color: var(--ms-primary);
  transform: translateX(4px);
}

.task-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.task-status.pending { background: var(--ms-warning); }
.task-status.progress { background: var(--ms-primary); }
.task-status.completed { background: var(--ms-success); }

.task-info {
  flex: 1;
}

.task-title {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.task-meta {
  font-size: 0.7rem;
  color: #666;
}

/* Features Section */
.features-section {
  padding: 6rem 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.0rem;
  font-weight: 700;
  color: var(--ms-dark);
  margin-bottom: 1rem;
}

.section-header p {
  font-size: 1.0rem;
  color: #666;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  color: var(--ms-primary);
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  color: var(--ms-dark);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.feature-highlight {
  display: inline-block;
  background: linear-gradient(135deg, var(--ms-primary), var(--ms-secondary));
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* Testimonials Section */
.testimonials-section {
  padding: 6rem 0;
  background: var(--ms-light);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.testimonial-content {
  margin-bottom: 1.5rem;
}

.testimonial-content p {
  font-style: italic;
  color: var(--ms-dark);
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--ms-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.author-name {
  font-weight: 600;
  color: var(--ms-dark);
  margin-bottom: 0.25rem;
}

.author-role {
  font-size: 0.8rem;
  color: #666;
}

/* CTA Section */
.cta-section {
  padding: 6rem 0;
  color: black;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.0rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.0rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cta-actions .btn-outline {
  border-color: var(--ms-primary);
  color: var(--ms-primary);
}

.cta-actions .btn-outline:hover {
  background: white;
  color: var(--ms-primary);
}

/* Footer */
.footer {
  background: var(--ms-dark);
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-brand h3 {
  color: white;
  margin-bottom: 1rem;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.link-group h4 {
  color: white;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.link-group a {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  transition: color 0.2s ease;
}

.link-group a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

/* Demo Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.demo-modal {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e1e1e1;
}

.demo-header h3 {
  margin: 0;
  color: var(--ms-dark);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  color: #666;
}

.close-btn:hover {
  background: var(--ms-light);
}

.demo-content {
  padding: 2rem;
}

.demo-placeholder {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--ms-light);
  border-radius: 8px;
}

.play-icon {
  color: var(--ms-primary);
  margin-bottom: 1rem;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .preview-content {
    flex-direction: column;
    height: auto;
  }
  
  .preview-sidebar {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .cta-content h2 {
    font-size: 2rem;
  }
}
</style>