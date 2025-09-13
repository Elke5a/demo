class DynamicDashboard {
    constructor() {
        this.isRunning = true;
        this.updateSpeed = 1500;
        this.isDarkTheme = false;
        this.chartData = [];
        this.maxDataPoints = 20;
        
        this.initializeElements();
        this.setupEventListeners();
        this.startUpdates();
        this.initializeChart();
    }

    initializeElements() {
        // Time display
        this.timeDisplay = document.getElementById('timeDisplay');
        
        // Stats elements
        this.visitorsCount = document.getElementById('visitorsCount');
        this.visitorsChange = document.getElementById('visitorsChange');
        this.revenueCount = document.getElementById('revenueCount');
        this.revenueChange = document.getElementById('revenueChange');
        this.ordersCount = document.getElementById('ordersCount');
        this.ordersChange = document.getElementById('ordersChange');
        this.performanceCount = document.getElementById('performanceCount');
        this.performanceChange = document.getElementById('performanceChange');
        
        // Controls
        this.themeToggle = document.getElementById('themeToggle');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Activity feed
        this.activityFeed = document.getElementById('activityFeed');
        
        // Progress bars
        this.cpuProgress = document.getElementById('cpuProgress');
        this.cpuValue = document.getElementById('cpuValue');
        this.memoryProgress = document.getElementById('memoryProgress');
        this.memoryValue = document.getElementById('memoryValue');
        this.storageProgress = document.getElementById('storageProgress');
        this.storageValue = document.getElementById('storageValue');
        
        // Chart
        this.canvas = document.getElementById('activityChart');
        this.ctx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Speed slider
        this.speedSlider.addEventListener('input', (e) => {
            this.updateSpeed = parseInt(e.target.value);
            this.speedValue.textContent = (this.updateSpeed / 1000).toFixed(1) + 's';
        });
        
        // Pause/Resume button
        this.pauseBtn.addEventListener('click', () => this.toggleUpdates());
        
        // Reset button
        this.resetBtn.addEventListener('click', () => this.resetData());
        
        // Stat card hover effects
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => this.animateStatCard(card));
        });
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
        this.themeToggle.textContent = this.isDarkTheme ? '☀️ Light' : '🌙 Dark';
    }

    toggleUpdates() {
        this.isRunning = !this.isRunning;
        this.pauseBtn.textContent = this.isRunning ? '⏸️ Pause Updates' : '▶️ Resume Updates';
        
        if (this.isRunning) {
            this.startUpdates();
        }
    }

    resetData() {
        this.chartData = [];
        this.activityFeed.innerHTML = '';
        this.updateStats();
        this.updateProgressBars();
        this.drawChart();
        this.addActivityItem('🔄', 'System Reset', 'All data has been reset');
    }

    startUpdates() {
        if (!this.isRunning) return;
        
        this.updateTime();
        this.updateStats();
        this.updateProgressBars();
        this.updateChart();
        this.addRandomActivity();
        
        setTimeout(() => this.startUpdates(), this.updateSpeed);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.timeDisplay.textContent = timeString;
    }

    updateStats() {
        // Generate realistic-looking data
        const visitors = Math.floor(Math.random() * 10000) + 5000;
        const revenue = Math.floor(Math.random() * 50000) + 25000;
        const orders = Math.floor(Math.random() * 500) + 200;
        const performance = Math.floor(Math.random() * 30) + 70;
        
        // Update with animation
        this.animateNumber(this.visitorsCount, visitors.toLocaleString());
        this.animateNumber(this.revenueCount, '$' + revenue.toLocaleString());
        this.animateNumber(this.ordersCount, orders.toLocaleString());
        this.animateNumber(this.performanceCount, performance + '%');
        
        // Update change indicators
        this.updateChangeIndicator(this.visitorsChange, Math.random() * 20 - 5);
        this.updateChangeIndicator(this.revenueChange, Math.random() * 15 - 2);
        this.updateChangeIndicator(this.ordersChange, Math.random() * 25 - 10);
        this.updateChangeIndicator(this.performanceChange, Math.random() * 10 - 2);
    }

    animateNumber(element, newValue) {
        element.style.transform = 'scale(1.1)';
        element.textContent = newValue;
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    updateChangeIndicator(element, change) {
        const isPositive = change >= 0;
        element.textContent = (isPositive ? '+' : '') + change.toFixed(1) + '%';
        element.className = 'stat-change ' + (isPositive ? 'positive' : 'negative');
    }

    updateProgressBars() {
        const cpu = Math.floor(Math.random() * 40) + 30;
        const memory = Math.floor(Math.random() * 50) + 25;
        const storage = Math.floor(Math.random() * 60) + 20;
        
        this.animateProgressBar(this.cpuProgress, this.cpuValue, cpu);
        this.animateProgressBar(this.memoryProgress, this.memoryValue, memory);
        this.animateProgressBar(this.storageProgress, this.storageValue, storage);
    }

    animateProgressBar(progressElement, valueElement, percentage) {
        progressElement.style.width = percentage + '%';
        valueElement.textContent = percentage + '%';
        
        // Color coding based on percentage
        if (percentage > 80) {
            progressElement.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
        } else if (percentage > 60) {
            progressElement.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
        } else {
            progressElement.style.background = 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))';
        }
    }

    updateChart() {
        const newDataPoint = Math.floor(Math.random() * 100) + 20;
        this.chartData.push(newDataPoint);
        
        if (this.chartData.length > this.maxDataPoints) {
            this.chartData.shift();
        }
        
        this.drawChart();
    }

    initializeChart() {
        // Initialize with some data
        for (let i = 0; i < 10; i++) {
            this.chartData.push(Math.floor(Math.random() * 100) + 20);
        }
        this.drawChart();
    }

    drawChart() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Set canvas size
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);
        
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        if (this.chartData.length === 0) return;
        
        // Draw grid
        ctx.strokeStyle = this.isDarkTheme ? '#334155' : '#e2e8f0';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw chart line
        if (this.chartData.length > 1) {
            const stepX = width / (this.maxDataPoints - 1);
            const maxValue = Math.max(...this.chartData);
            const minValue = Math.min(...this.chartData);
            const range = maxValue - minValue || 1;
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
            
            // Draw area
            ctx.beginPath();
            ctx.moveTo(0, height);
            
            this.chartData.forEach((value, index) => {
                const x = index * stepX;
                const y = height - ((value - minValue) / range) * height;
                if (index === 0) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.lineTo((this.chartData.length - 1) * stepX, height);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw line
            ctx.beginPath();
            this.chartData.forEach((value, index) => {
                const x = index * stepX;
                const y = height - ((value - minValue) / range) * height;
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw points
            ctx.fillStyle = '#3b82f6';
            this.chartData.forEach((value, index) => {
                const x = index * stepX;
                const y = height - ((value - minValue) / range) * height;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    addRandomActivity() {
        const activities = [
            { icon: '👤', title: 'New User Registration', desc: 'User joined the platform' },
            { icon: '💳', title: 'Payment Processed', desc: 'Transaction completed successfully' },
            { icon: '📧', title: 'Email Sent', desc: 'Newsletter delivered to subscribers' },
            { icon: '🔔', title: 'System Alert', desc: 'Performance threshold reached' },
            { icon: '📊', title: 'Report Generated', desc: 'Monthly analytics compiled' },
            { icon: '🛒', title: 'Order Placed', desc: 'New purchase order received' },
            { icon: '⚡', title: 'Server Optimized', desc: 'Performance improvements applied' },
            { icon: '🔒', title: 'Security Scan', desc: 'System security check completed' }
        ];
        
        const activity = activities[Math.floor(Math.random() * activities.length)];
        this.addActivityItem(activity.icon, activity.title, activity.desc);
    }

    addActivityItem(icon, title, description) {
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        item.innerHTML = `
            <div class="activity-icon">${icon}</div>
            <div class="activity-content">
                <div class="activity-title">${title}</div>
                <div class="activity-time">${description} • ${timeString}</div>
            </div>
        `;
        
        this.activityFeed.insertBefore(item, this.activityFeed.firstChild);
        
        // Remove old items if too many
        const items = this.activityFeed.children;
        if (items.length > 10) {
            this.activityFeed.removeChild(items[items.length - 1]);
        }
    }

    animateStatCard(card) {
        const icon = card.querySelector('.stat-icon');
        icon.style.transform = 'rotate(360deg) scale(1.1)';
        setTimeout(() => {
            icon.style.transform = 'rotate(0deg) scale(1)';
        }, 500);
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DynamicDashboard();
});

// Add some CSS transitions via JavaScript for better performance
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .stat-icon {
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stat-number {
            transition: transform 0.2s ease;
        }
        
        .progress-fill {
            transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});