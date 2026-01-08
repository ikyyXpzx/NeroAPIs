// public/script.js - UPDATED WITH ANIMATIONS
const BASE_URL = window.location.origin;
let isRequestInProgress = false;
let apiData = null;
let currentTheme = 'dark';
let allApiElements = [];
let totalEndpoints = 0;
let totalCategories = 0;
let batteryMonitor = null;

// Fungsi untuk membuat partikel background
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 5 + 1;
        const posX = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.background = color;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Fungsi untuk animasi loading bar
function showLoadingBar() {
    let loadingBar = document.getElementById('loadingBar');
    if (!loadingBar) {
        loadingBar = document.createElement('div');
        loadingBar.id = 'loadingBar';
        loadingBar.className = 'loading-bar';
        document.body.appendChild(loadingBar);
    }
    loadingBar.style.display = 'block';
}

function hideLoadingBar() {
    const loadingBar = document.getElementById('loadingBar');
    if (loadingBar) {
        loadingBar.style.display = 'none';
    }
}

// Enhanced theme functions dengan animasi
const themeToggleBtn = document.getElementById('themeToggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
const body = document.body;

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    currentTheme = savedTheme;
    
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggleDarkIcon.style.transform = 'rotate(180deg) scale(0)';
        themeToggleLightIcon.style.transform = 'rotate(0deg) scale(1)';
        themeToggleDarkIcon.classList.add('hidden');
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        body.classList.remove('light-mode');
        themeToggleLightIcon.style.transform = 'rotate(180deg) scale(0)';
        themeToggleDarkIcon.style.transform = 'rotate(0deg) scale(1)';
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleLightIcon.classList.add('hidden');
    }
    
    updateSocialBadges();
}

function toggleTheme() {
    // Add ripple effect
    const ripple = document.createElement('span');
    const rect = themeToggleBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
    `;
    
    themeToggleBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    // Toggle theme dengan animasi
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        themeToggleBtn.style.transform = 'scale(0.9) rotate(180deg)';
        
        setTimeout(() => {
            themeToggleDarkIcon.style.transform = 'rotate(0deg) scale(1)';
            themeToggleLightIcon.style.transform = 'rotate(180deg) scale(0)';
            themeToggleDarkIcon.classList.remove('hidden');
            themeToggleLightIcon.classList.add('hidden');
            themeToggleBtn.style.transform = 'scale(1) rotate(0deg)';
            currentTheme = 'dark';
        }, 300);
    } else {
        body.classList.add('light-mode');
        themeToggleBtn.style.transform = 'scale(0.9) rotate(180deg)';
        
        setTimeout(() => {
            themeToggleLightIcon.style.transform = 'rotate(0deg) scale(1)';
            themeToggleDarkIcon.style.transform = 'rotate(180deg) scale(0)';
            themeToggleLightIcon.classList.remove('hidden');
            themeToggleDarkIcon.classList.add('hidden');
            themeToggleBtn.style.transform = 'scale(1) rotate(0deg)';
            currentTheme = 'light';
        }, 300);
    }
    
    localStorage.setItem('theme', currentTheme);
    updateSocialBadges();
    
    if (apiData) {
        loadApis();
    }
}

// Enhanced social badges dengan hover effects
function updateSocialBadges() {
    const isLightMode = body.classList.contains('light-mode');
    const socialBadges = document.querySelectorAll('.social-badge > div');
    
    socialBadges.forEach(badge => {
        badge.className = 'px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2';
        
        if (isLightMode) {
            badge.classList.add('bg-gray-100', 'text-gray-800', 'hover:bg-gray-200');
        } else {
            badge.classList.add('bg-gray-800', 'text-gray-300', 'hover:bg-gray-700');
        }
    });
}

// Enhanced battery detection dengan animasi
function initBatteryDetection() {
    const batteryLevelElement = document.getElementById('batteryLevel');
    const batteryPercentageElement = document.getElementById('batteryPercentage');
    const batteryStatusElement = document.getElementById('batteryStatus');
    const batteryContainer = document.getElementById('batteryContainer');
    
    // Add animation class
    batteryContainer.classList.add('battery-pulse');
    
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            function updateBatteryInfo() {
                const level = battery.level * 100;
                const isCharging = battery.charging;
                const roundedLevel = Math.round(level);
                const isLightMode = body.classList.contains('light-mode');
                
                // Animate percentage change
                const oldPercentage = parseInt(batteryPercentageElement.textContent) || 0;
                animateValue(batteryPercentageElement, oldPercentage, roundedLevel, 500);
                
                // Animate battery level
                batteryLevelElement.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
                batteryLevelElement.style.width = `${level}%`;
                
                // Update warna dengan animasi
                batteryLevelElement.style.transition = 'background-color 0.5s ease';
                if (level > 60) {
                    batteryLevelElement.className = 'battery-level ' + (isLightMode ? 'bg-green-600' : 'bg-green-500');
                } else if (level > 20) {
                    batteryLevelElement.className = 'battery-level ' + (isLightMode ? 'bg-yellow-600' : 'bg-yellow-500');
                } else {
                    batteryLevelElement.className = 'battery-level ' + (isLightMode ? 'bg-red-600' : 'bg-red-500');
                }
                
                // Update status dengan animasi
                if (isCharging) {
                    batteryContainer.classList.add('charging');
                    batteryStatusElement.textContent = 'Charging';
                    batteryLevelElement.classList.add('battery-charging');
                } else {
                    batteryContainer.classList.remove('charging');
                    batteryLevelElement.classList.remove('battery-charging');
                    
                    if (battery.dischargingTime === Infinity) {
                        batteryStatusElement.textContent = 'Fully charged';
                    } else {
                        batteryStatusElement.textContent = 'Discharging';
                    }
                }
                
                // Update waktu estimasi
                if (isCharging && battery.chargingTime !== Infinity) {
                    const hours = Math.floor(battery.chargingTime / 3600);
                    const minutes = Math.floor((battery.chargingTime % 3600) / 60);
                    batteryStatusElement.textContent = `Charging (${hours}h ${minutes}m)`;
                } else if (!isCharging && battery.dischargingTime !== Infinity) {
                    const hours = Math.floor(battery.dischargingTime / 3600);
                    const minutes = Math.floor((battery.dischargingTime % 3600) / 60);
                    batteryStatusElement.textContent = `${hours}h ${minutes}m left`;
                }
            }
            
            updateBatteryInfo();
            
            battery.addEventListener('levelchange', updateBatteryInfo);
            battery.addEventListener('chargingchange', updateBatteryInfo);
            battery.addEventListener('chargingtimechange', updateBatteryInfo);
            battery.addEventListener('dischargingtimechange', updateBatteryInfo);
            
            batteryMonitor = battery;
            
        }).catch(function(error) {
            console.error("Battery API error:", error);
            batteryStatusElement.textContent = 'API Error';
            fallbackBattery();
        });
    } else {
        batteryStatusElement.textContent = 'API Not Supported';
        fallbackBattery();
    }
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = `${value}%`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// Enhanced toast dengan animasi
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    toastMessage.textContent = message;
    
    if (isError) {
        toastIcon.innerHTML = '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>';
        toast.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        toast.style.background = 'rgba(239, 68, 68, 0.1)';
    } else {
        toastIcon.innerHTML = '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>';
        toast.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        toast.style.background = 'rgba(34, 197, 94, 0.1)';
    }
    
    toast.classList.add('show');
    
    // Add vibration effect for errors
    if (isError && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
        // Reset toast style
        setTimeout(() => {
            toast.style.borderColor = '';
            toast.style.background = '';
        }, 600);
    }, 3000);
}

// Enhanced copy dengan animasi
function copyText(text, type = 'path') {
    // Add visual feedback
    const button = event.target;
    const originalText = button.textContent;
    const originalBackground = button.style.background;
    
    button.textContent = '✓ Copied!';
    button.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
    
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${type} copied to clipboard!`);
        
        // Reset button after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBackground;
        }, 1500);
        
    }).catch(() => {
        showToast('Failed to copy', true);
        button.textContent = originalText;
        button.style.background = originalBackground;
    });
}

// Enhanced toggle dengan animasi
function toggleCategory(index) {
    const content = document.getElementById(`cat-${index}`);
    const icon = document.getElementById(`cat-icon-${index}`);
    
    content.classList.toggle('hidden');
    
    if (content.classList.contains('hidden')) {
        icon.style.transform = 'rotate(0deg)';
        icon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
        icon.style.transform = 'rotate(180deg)';
        icon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Add slight bounce effect
        setTimeout(() => {
            icon.style.transform = 'rotate(180deg) scale(1.2)';
            setTimeout(() => {
                icon.style.transform = 'rotate(180deg) scale(1)';
            }, 100);
        }, 400);
    }
}

function toggleEndpoint(catIdx, epIdx) {
    const content = document.getElementById(`ep-${catIdx}-${epIdx}`);
    const icon = document.getElementById(`ep-icon-${catIdx}-${epIdx}`);
    
    content.classList.toggle('hidden');
    
    if (content.classList.contains('hidden')) {
        icon.style.transform = 'rotate(0deg)';
        icon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
        icon.style.transform = 'rotate(180deg)';
        icon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }
}

// Enhanced execute request dengan animasi loading
async function executeRequest(e, catIdx, epIdx, method, path) {
    e.preventDefault();
    
    if (isRequestInProgress) {
        showToast('Please wait for current request', true);
        return;
    }

    const form = document.getElementById(`form-${catIdx}-${epIdx}`);
    const responseDiv = document.getElementById(`response-${catIdx}-${epIdx}`);
    const responseContent = document.getElementById(`response-content-${catIdx}-${epIdx}`);
    const curlSection = document.getElementById(`curl-section-${catIdx}-${epIdx}`);
    const curlCommand = document.getElementById(`curl-command-${catIdx}-${epIdx}`);
    const executeBtn = form.querySelector('button[type="submit"]');
    
    // Create enhanced loading spinner
    let spinner = executeBtn.querySelector('.local-spinner');
    if (!spinner) {
        spinner = document.createElement('span');
        spinner.className = 'local-spinner ml-2';
        executeBtn.appendChild(spinner);
    }
    
    // Show loading bar
    showLoadingBar();
    
    // Set loading state dengan animasi
    isRequestInProgress = true;
    executeBtn.disabled = true;
    executeBtn.classList.add('btn-loading');
    spinner.classList.add('active');
    
    // Animate button
    executeBtn.style.transform = 'scale(0.95)';
    
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        if (value) params.append(key, value);
    }

    const fullPath = `${BASE_URL}${path.split('?')[0]}?${params.toString()}`;
    
    // Animate response div appearance
    responseDiv.style.opacity = '0';
    responseDiv.style.transform = 'translateY(20px)';
    responseDiv.classList.remove('hidden');
    
    setTimeout(() => {
        responseDiv.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        responseDiv.style.opacity = '1';
        responseDiv.style.transform = 'translateY(0)';
    }, 10);
    
    responseContent.innerHTML = '<div class="spinner mx-auto"></div>';
    
    const curlText = `curl -X ${method} "${fullPath}"`;
    curlCommand.textContent = curlText;
    curlSection.classList.remove('hidden');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
        const response = await fetch(fullPath, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const contentType = response.headers.get("content-type");
        
        // Animate response content
        responseContent.style.opacity = '0';
        
        if (contentType?.includes("application/json")) {
            const data = await response.json();
            setTimeout(() => {
                responseContent.innerHTML = `<pre class="code-font text-sm overflow-auto">${JSON.stringify(data, null, 2)}</pre>`;
                responseContent.style.opacity = '1';
                responseContent.style.transition = 'opacity 0.5s ease';
            }, 300);
        } else if (contentType?.startsWith("image/")) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setTimeout(() => {
                responseContent.innerHTML = createMediaPreview(imageUrl, contentType);
                responseContent.style.opacity = '1';
                responseContent.style.transition = 'opacity 0.5s ease';
            }, 300);
        } else if (contentType?.startsWith("video/")) {
            const blob = await response.blob();
            const videoUrl = URL.createObjectURL(blob);
            setTimeout(() => {
                responseContent.innerHTML = createMediaPreview(videoUrl, contentType);
                responseContent.style.opacity = '1';
                responseContent.style.transition = 'opacity 0.5s ease';
            }, 300);
        } else if (contentType?.startsWith("audio/")) {
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            setTimeout(() => {
                responseContent.innerHTML = createMediaPreview(audioUrl, contentType);
                responseContent.style.opacity = '1';
                responseContent.style.transition = 'opacity 0.5s ease';
            }, 300);
        } else if (contentType?.includes("application/pdf")) {
            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            setTimeout(() => {
                responseContent.innerHTML = createMediaPreview(pdfUrl, contentType);
                responseContent.style.opacity = '1';
                responseContent.style.transition = 'opacity 0.5s ease';
            }, 300);
        } else {
            const text = await response.text();
            
            setTimeout(() => {
                if (isMediaFile(text)) {
                    responseContent.innerHTML = createMediaPreview(text, contentType);
                } else {
                    responseContent.innerHTML = `<pre class="code-font text-sm overflow-auto">${text}</pre>`;
                }
                responseContent.style.opacity = '1';
                responseContent.style.transition = 'opacity 0.5s ease';
            }, 300);
        }
        
        // Success animation
        executeBtn.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        setTimeout(() => {
            executeBtn.style.background = '';
        }, 1000);
        
        showToast('Request completed successfully!');
        
    } catch (error) {
        clearTimeout(timeoutId);
        const errorMsg = error.name === 'AbortError' ? 'Request timeout (30s)' : error.message;
        
        // Error animation
        executeBtn.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
        setTimeout(() => {
            executeBtn.style.background = '';
        }, 1000);
        
        setTimeout(() => {
            responseContent.innerHTML = `<pre class="text-red-400 code-font text-sm">Error: ${errorMsg}</pre>`;
            responseContent.style.opacity = '1';
            responseContent.style.transition = 'opacity 0.5s ease';
        }, 300);
        
        showToast('Request failed!', true);
        
    } finally {
        // Reset loading state dengan animasi
        setTimeout(() => {
            isRequestInProgress = false;
            executeBtn.disabled = false;
            executeBtn.classList.remove('btn-loading');
            executeBtn.style.transform = '';
            spinner.classList.remove('active');
            hideLoadingBar();
        }, 300);
    }
}

// Enhanced loadApis dengan staggered animation
function loadApis() {
    const apiList = document.getElementById('apiList');
    if (!apiData || !apiData.categories) {
        apiList.innerHTML = '<p class="text-center">No API data loaded.</p>';
        return;
    }
    
    const isLightMode = body.classList.contains('light-mode');
    
    totalEndpoints = 0;
    totalCategories = apiData.categories.length;
    
    apiData.categories.forEach(category => {
        totalEndpoints += category.items.length;
    });
    
    updateTotalEndpoints();
    updateTotalCategories();
    
    let html = '';
    apiData.categories.forEach((category, catIdx) => {
        html += `
        <div class="category-group fade-in" data-category="${category.name.toLowerCase()}" style="--item-index: ${catIdx}">
            <div class="glass-effect ${isLightMode ? 'border-gray-300' : 'border-gray-700'} border rounded-2xl overflow-hidden card-hover">
                <button onclick="toggleCategory(${catIdx})" class="w-full px-6 py-4 flex items-center justify-between ${isLightMode ? 'hover:bg-gray-100' : 'hover:bg-gray-800/50'} transition-colors group">
                    <div class="flex items-center gap-4">
                        <span class="text-xl transform group-hover:scale-110 transition-transform">${category.icon || '📁'}</span>
                        <div class="text-left">
                            <h3 class="font-bold text-base gray-gradient-text group-hover:text-transparent">${category.name}</h3>
                            <p class="text-xs ${isLightMode ? 'text-gray-600' : 'text-gray-400'} mt-1">${category.items.length} endpoints</p>
                        </div>
                    </div>
                    <svg id="cat-icon-${catIdx}" class="w-5 h-5 ${isLightMode ? 'text-gray-600' : 'text-gray-400'} transition-all duration-300 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                
                <div id="cat-${catIdx}" class="hidden">`;
        
        category.items.forEach((item, epIdx) => {
            const method = 'GET';
            const pathParts = item.path.split('?');
            const path = pathParts[0];
            const queryParams = new URLSearchParams(pathParts[1] || '');

            let statusClass = 'status-ready';
            if (item.status === 'update') statusClass = 'status-update';
            if (item.status === 'error') statusClass = 'status-error';

            html += `
            <div class="api-item border-t ${isLightMode ? 'border-gray-300' : 'border-gray-700/50'}" 
                data-method="${method}"
                data-path="${path}"
                data-alias="${item.name.toLowerCase()}"
                data-description="${item.desc.toLowerCase()}"
                data-category="${category.name.toLowerCase()}">
                <button onclick="toggleEndpoint(${catIdx}, ${epIdx})" class="w-full px-6 py-3 flex items-center justify-between ${isLightMode ? 'hover:bg-gray-100' : 'hover:bg-gray-800/30'} transition-all group">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <span class="${isLightMode ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'} px-3 py-1 rounded-lg text-xs font-mono transform group-hover:scale-105 transition-transform">${method}</span>
                        <div class="text-left flex-1 min-w-0">
                            <p class="code-font font-semibold text-sm truncate group-hover:text-purple-400 transition-colors">${path}</p>
                            <div class="flex items-center gap-2 mt-1">
                                <p class="text-xs ${isLightMode ? 'text-gray-700' : 'text-gray-300'} truncate">${item.name}</p>
                                <span class="px-2 py-1 text-xs rounded-full ${statusClass} flex-shrink-0 transform group-hover:scale-110 transition-transform">${item.status || 'ready'}</span>
                            </div>
                        </div>
                    </div>
                    <svg id="ep-icon-${catIdx}-${epIdx}" class="w-5 h-5 ${isLightMode ? 'text-gray-600' : 'text-gray-400'} transition-all duration-300 group-hover:text-purple-500 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                
                <div id="ep-${catIdx}-${epIdx}" class="hidden ${isLightMode ? 'bg-gray-100' : 'bg-gray-800/20'} px-6 py-4 border-t ${isLightMode ? 'border-gray-300' : 'border-gray-700/50'}">
                    <p class="${isLightMode ? 'text-gray-700' : 'text-gray-300'} mb-4 text-sm leading-relaxed">${item.desc}</p>
                    
                    <div class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="font-bold text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'} flex items-center gap-2">
                                <span class="text-purple-500">🔗</span> Endpoint
                            </h4>
                            <div class="flex gap-2">
                                <button onclick="copyText('${path}', 'Path')" class="px-3 py-1.5 ${isLightMode ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-800 hover:bg-gray-700'} rounded-lg text-xs transition-all hover:scale-105 active:scale-95">
                                    Copy Path
                                </button>
                                <button onclick="copyText('${BASE_URL}${path}', 'URL')" class="px-3 py-1.5 ${isLightMode ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-800 hover:bg-gray-700'} rounded-lg text-xs transition-all hover:scale-105 active:scale-95">
                                    Copy Full URL
                                </button>
                            </div>
                        </div>
                        <div class="${isLightMode ? 'bg-gray-200 border-gray-300' : 'bg-gray-900/50 border-gray-700'} border px-4 py-3 rounded-xl">
                            <code class="code-font text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'} break-all">${path}</code>
                        </div>
                    </div>`;

            if (item.status === 'ready') {
                html += `
                    <div>
                        <h4 class="font-bold text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'} mb-4 flex items-center gap-2">
                            <span class="text-yellow-500">⚡</span> Try it out
                        </h4>
                        <form id="form-${catIdx}-${epIdx}" onsubmit="executeRequest(event, ${catIdx}, ${epIdx}, '${method}', '${path}')">
                            <div class="space-y-4 mb-6">`;
                
                if (item.params) {
                    Object.keys(item.params).forEach(paramName => {
                        const isRequired = !queryParams.has(paramName) || queryParams.get(paramName) === '';
                        html += `
                            <div class="transform hover:translate-x-1 transition-transform">
                                <label class="block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'} mb-2">
                                    ${paramName} ${isRequired ? '<span class="text-red-500">*</span>' : ''}
                                </label>
                                <input 
                                    type="text" 
                                    name="${paramName}" 
                                    class="glass-effect w-full px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 code-font text-sm transition-all"
                                    placeholder="${item.params[paramName]}" 
                                    ${isRequired ? 'required' : ''}
                                    onfocus="this.parentElement.style.transform = 'translateX(4px)'"
                                    onblur="this.parentElement.style.transform = ''"
                                >
                            </div>`;
                    });
                }
                
                html += `
                            </div>
                            <div class="flex gap-3 flex-wrap">
                                <button type="submit" class="nero-btn px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center group">
                                    <span class="transform group-hover:scale-110 transition-transform">Execute</span>
                                    <span class="local-spinner ml-2"></span>
                                </button>
                                <button type="button" onclick="clearResponse(${catIdx}, ${epIdx})" class="px-8 py-3 ${isLightMode ? 'bg-gray-300 hover:bg-gray-400 border-gray-400' : 'bg-gray-700 hover:bg-gray-600 border-gray-600'} border rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95">
                                    Clear
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div id="curl-section-${catIdx}-${epIdx}" class="hidden mt-6">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="font-bold text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'} flex items-center gap-2">
                                <span class="text-green-500">📟</span> cURL Command
                            </h4>
                            <button onclick="copyText(document.getElementById('curl-command-${catIdx}-${epIdx}').textContent, 'cURL')" class="px-3 py-1.5 ${isLightMode ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-800 hover:bg-gray-700'} rounded-lg text-xs transition-all hover:scale-105 active:scale-95">
                                Copy cURL
                            </button>
                        </div>
                        <div class="${isLightMode ? 'bg-gray-200 border-gray-300' : 'bg-gray-900/50 border-gray-700'} border px-4 py-3 rounded-xl">
                            <code id="curl-command-${catIdx}-${epIdx}" class="code-font text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'} break-all">curl -X ${method} "${BASE_URL}${path}"</code>
                        </div>
                    </div>
                    
                    <div id="response-${catIdx}-${epIdx}" class="hidden mt-6">
                        <h4 class="font-bold text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'} mb-3 flex items-center gap-2">
                            <span class="text-blue-500">📄</span> Response
                        </h4>
                        <div class="glass-effect border ${isLightMode ? 'border-gray-300' : 'border-gray-700'} px-5 py-4 rounded-xl max-h-96 overflow-auto transition-all" id="response-content-${catIdx}-${epIdx}"></div>
                    </div>`;
            } else {
                html += `<div class="px-5 py-4 status-warning border rounded-xl text-sm transform hover:scale-[1.02] transition-transform">⚠️ This endpoint is not available for testing</div>`;
            }

            html += `
                </div>
            </div>`;
        });
        
        html += `</div></div></div>`;
    });
    
    apiList.innerHTML = html;
    allApiElements = Array.from(document.querySelectorAll('.api-item'));
    
    // Animate each category with delay
    const categories = document.querySelectorAll('.category-group');
    categories.forEach((cat, index) => {
        cat.style.animationDelay = `${index * 0.1}s`;
    });
}

// Enhanced search dengan animation
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const noResults = document.getElementById('noResults');

    if (searchTerm === '') {
        document.querySelectorAll('.category-group').forEach(cat => {
            cat.style.opacity = '1';
            cat.style.transform = 'translateY(0)';
            cat.style.display = 'block';
            cat.querySelectorAll('.api-item').forEach(item => {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        });
        noResults.style.opacity = '0';
        noResults.style.transform = 'scale(0.9)';
        setTimeout(() => noResults.classList.add('hidden'), 300);
        return;
    }

    let hasVisibleItems = false;

    document.querySelectorAll('.category-group').forEach(category => {
        let categoryHasVisibleItems = false;
        
        category.querySelectorAll('.api-item').forEach(item => {
            const path = item.dataset.path.toLowerCase();
            const alias = item.dataset.alias;
            const desc = item.dataset.description;
            const categoryName = item.dataset.category;

            const matches = 
                path.includes(searchTerm) || 
                alias.includes(searchTerm) || 
                desc.includes(searchTerm) ||
                categoryName.includes(searchTerm);

            if (matches) {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                categoryHasVisibleItems = true;
                hasVisibleItems = true;
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 400);
            }
        });

        if (categoryHasVisibleItems) {
            category.style.display = 'block';
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
        } else {
            category.style.opacity = '0';
            category.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                category.style.display = 'none';
            }, 400);
        }
    });

    if (hasVisibleItems) {
        noResults.style.opacity = '0';
        noResults.style.transform = 'scale(0.9)';
        setTimeout(() => noResults.classList.add('hidden'), 300);
    } else {
        noResults.classList.remove('hidden');
        noResults.style.opacity = '0';
        noResults.style.transform = 'scale(0.9)';
        setTimeout(() => {
            noResults.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            noResults.style.opacity = '1';
            noResults.style.transform = 'scale(1)';
        }, 10);
    }
}

// Enhanced Nero branding
function initNeroBranding() {
    document.title = "NeroAPIs - Powerful API Collection";
    
    const logoImg = document.getElementById('logoImg');
    if (logoImg) {
        logoImg.addEventListener('mouseenter', () => {
            logoImg.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        logoImg.addEventListener('mouseleave', () => {
            logoImg.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // Add typing effect for console greeting
    const consoleText = `🔥 NeroAPIs v1.0.0 🔥
Powerful API Collection for Developers
https://neroapis.vercel.app`;
    
    console.log('%c' + consoleText, `
        background: linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6);
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.5;
    `);
}

// Enhanced initialization dengan animasi
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing NeroAPIs with enhanced animations...');
    
    // Create particles
    createParticles();
    
    // Initialize components dengan delay
    setTimeout(() => initTheme(), 100);
    setTimeout(() => initBatteryDetection(), 200);
    setTimeout(() => initNeroBranding(), 300);
    
    // Animate header elements
    const headerElements = document.querySelectorAll('#api h1, #api p, #api .stats-card');
    headerElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 500 + (index * 100));
    });
    
    // Load API data
    setTimeout(() => {
        fetch('listapi.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load listapi.json');
                return res.json();
            })
            .then(data => {
                apiData = data;
                console.log('✅ API data loaded successfully:', data.categories.length, 'categories');
                
                // Animate search input
                const searchInput = document.getElementById('searchInput');
                searchInput.style.opacity = '0';
                searchInput.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    searchInput.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    searchInput.style.opacity = '1';
                    searchInput.style.transform = 'translateY(0)';
                    loadApis();
                }, 300);
            })
            .catch(err => {
                console.error('❌ Error loading API data:', err);
                const apiList = document.getElementById('apiList');
                apiList.innerHTML = `
                    <div class="text-center p-8 bg-red-900/20 border border-red-700 rounded-2xl transform hover:scale-[1.02] transition-all">
                        <div class="text-4xl mb-4 animate-bounce">⚠️</div>
                        <h3 class="font-bold text-lg mb-2">Failed to load API data</h3>
                        <p class="text-sm">Please check if listapi.json exists on the server</p>
                        <p class="text-xs mt-4 text-gray-400">Error: ${err.message}</p>
                    </div>
                `;
            });
    }, 800);
});

// Enhanced event listeners
themeToggleBtn.addEventListener('click', toggleTheme);

// Search dengan debounce dan animation
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function() {
    clearTimeout(searchTimeout);
    
    // Add search animation
    const searchIcon = this.parentElement.querySelector('svg');
    searchIcon.style.transform = 'scale(1.2) rotate(10deg)';
    setTimeout(() => {
        searchIcon.style.transform = 'scale(1) rotate(0deg)';
        searchIcon.style.transition = 'transform 0.3s ease';
    }, 300);
    
    searchTimeout = setTimeout(performSearch, 300);
});

// Enhanced keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        searchInput.focus();
        
        // Animate search input on focus
        searchInput.style.transform = 'scale(1.02)';
        setTimeout(() => {
            searchInput.style.transform = 'scale(1)';
            searchInput.style.transition = 'transform 0.3s ease';
        }, 300);
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (document.activeElement === searchInput) {
            searchInput.value = '';
            performSearch();
            
            // Add clear animation
            searchInput.style.transform = 'scale(0.98)';
            setTimeout(() => {
                searchInput.style.transform = 'scale(1)';
                searchInput.style.transition = 'transform 0.3s ease';
            }, 300);
        }
    }
});

// Enhanced smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Add scroll animation
            targetElement.style.opacity = '0.8';
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                targetElement.style.transition = 'opacity 0.3s ease';
                targetElement.style.opacity = '1';
            }, 500);
        }
    });
});

// Enhanced click outside search
document.addEventListener('click', function(event) {
    const searchInput = document.getElementById('searchInput');
    const searchContainer = document.querySelector('.relative');
    
    if (!searchContainer.contains(event.target)) {
        if (searchInput.value.trim() === '') {
            performSearch();
        }
    }
});

// Enhanced cleanup
window.addEventListener('beforeunload', function() {
    cleanupBatteryMonitor();
    
    // Add exit animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Helper functions tetap sama
function updateTotalEndpoints() {
    const totalEndpointsElement = document.getElementById('totalEndpoints');
    totalEndpointsElement.textContent = totalEndpoints;
    
    // Animate number change
    totalEndpointsElement.style.transform = 'scale(1.2)';
    totalEndpointsElement.style.color = '#8b5cf6';
    setTimeout(() => {
        totalEndpointsElement.style.transform = 'scale(1)';
        totalEndpointsElement.style.color = '';
        totalEndpointsElement.style.transition = 'all 0.3s ease';
    }, 300);
}

function updateTotalCategories() {
    const totalCategoriesElement = document.getElementById('totalCategories');
    totalCategoriesElement.textContent = totalCategories;
    
    // Animate number change
    totalCategoriesElement.style.transform = 'scale(1.2)';
    totalCategoriesElement.style.color = '#ec4899';
    setTimeout(() => {
        totalCategoriesElement.style.transform = 'scale(1)';
        totalCategoriesElement.style.color = '';
        totalCategoriesElement.style.transition = 'all 0.3s ease';
    }, 300);
}

// Helper functions lainnya tetap sama seperti sebelumnya...
// [Semua helper functions lainnya dari script sebelumnya tetap ada di sini]