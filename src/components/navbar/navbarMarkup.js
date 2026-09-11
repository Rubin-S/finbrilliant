/**
 * FinBrilliant Navbar HTML Template Generator
 * Renders Top Brand Header, Floating Capsule Bottom Dock, and Command Palette Modal.
 */

export function getNavbarMarkup({ profile, tier, isLight, navTabs, progressPercent, platformShortcut, state }) {
  return `
    <!-- Top Minimal Brand Header (Height: 56px) -->
    <header class="fin-navbar fin-top-header w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#090d14]/85 backdrop-blur-md transition-colors duration-150 select-none">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        <!-- Left: Folded Origami Logo & Brand Wordmark -->
        <div class="brand-logo flex items-center gap-2.5 cursor-pointer group shrink-0" data-view="courses" title="FinBrilliant Home">
          <svg class="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="finLogoGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <linearGradient id="finLogoGradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#34d399" />
                <stop offset="100%" stop-color="#059669" />
              </linearGradient>
              <filter id="finLogoShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="0.8" flood-opacity="0.35" />
              </filter>
            </defs>
            <rect x="10" y="2" width="14" height="14" rx="3.5" fill="url(#finLogoGradCyan)" />
            <path d="M10 10 L16 16 L10 16 Z" fill="#042f2e" opacity="0.45" />
            <rect x="2" y="10" width="14" height="14" rx="3.5" fill="url(#finLogoGradEmerald)" filter="url(#finLogoShadow)" />
          </svg>

          <div class="flex flex-col justify-center">
            <span class="brand-text font-bold text-[15px] tracking-tight text-slate-900 dark:text-white leading-none">FinBrilliant</span>
            <p class="tagline-text text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-none mt-1 tracking-normal">First-Principles Finance</p>
          </div>
        </div>

        <!-- Right: XP Readout, Notification Bell, User Avatar JD -->
        <div class="flex items-center gap-3 shrink-0">
          <!-- XP Readout with Progress Bar directly below -->
          <div class="xp-badge flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group" data-view="goal" title="XP Progress: ${profile.xp} XP • Rank: ${tier.title} (${progressPercent}% to next tier)">
            <svg class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            <div class="flex flex-col justify-center text-left">
              <span class="text-[11px] font-bold font-mono text-slate-800 dark:text-slate-200 leading-none tabular-nums">${profile.xp} XP</span>
              <div class="w-[44px] h-[2.5px] bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div id="navbar-xp-fill" class="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
              </div>
            </div>
          </div>

          <!-- Vertical Hairline Divider -->
          <div class="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 shrink-0 hidden xs:block"></div>

          <!-- Notification Bell with Status Dot -->
          <div class="relative shrink-0 flex items-center">
            <button class="bell-toggle p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-center relative" title="Notifications & Announcements" aria-label="Notifications" aria-expanded="false">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950"></span>
            </button>

            <!-- Notification Popover Menu -->
            <div id="notifications-popover" class="hidden absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-[#111923] border border-slate-200 dark:border-[#223041] rounded-xl shadow-2xl p-3 z-50 text-xs text-slate-800 dark:text-slate-200">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs">Notifications</span>
                <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Live</span>
              </div>
              <div class="space-y-2 mt-2">
                <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-2 cursor-pointer hover:border-emerald-500/40 transition nav-btn" data-view="boost">
                  <span class="text-sm">⚡</span>
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-slate-200 text-[11.5px]">Daily Boost Ready</p>
                    <p class="text-[10.5px] text-slate-500 dark:text-slate-400">Claim 2X XP in today's quantitative challenge.</p>
                  </div>
                </div>
                <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-2 cursor-pointer hover:border-amber-500/40 transition nav-btn" data-view="goal">
                  <span class="text-sm">🔥</span>
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-slate-200 text-[11.5px]">${profile.streak} Day Streak Active</p>
                    <p class="text-[10.5px] text-slate-500 dark:text-slate-400">Keep learning today to maintain your streak!</p>
                  </div>
                </div>
                <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-2 cursor-pointer hover:border-emerald-500/40 transition nav-btn" data-view="goal">
                  <span class="text-sm">🏆</span>
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-slate-200 text-[11.5px]">Rank: ${tier.title}</p>
                    <p class="text-[10.5px] text-slate-500 dark:text-slate-400">${profile.xp} XP total • Level ${tier.rank || 1}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Theme Toggle (Visible 1-click Button) -->
          <button class="theme-toggle p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-center text-sm" title="${isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}" aria-label="Toggle theme">
            <span class="select-none">${isLight ? '🌙' : '☀️'}</span>
          </button>

          <!-- User Avatar JD & Chevron with Dropdown Menu -->
          <div class="relative shrink-0 flex items-center">
            <button class="profile-toggle flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-700 transition cursor-pointer group" title="Account & Preferences: John Doe" aria-label="User profile and settings" aria-expanded="false">
              <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center font-mono group-hover:border-emerald-500/60 transition-colors">JD</div>
              <svg class="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform profile-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <!-- Profile & Settings Popover Menu -->
            <div id="profile-dropdown" class="hidden absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#111923] border border-slate-200 dark:border-[#223041] rounded-xl shadow-2xl p-2.5 z-50 text-xs text-slate-800 dark:text-slate-200">
              <div class="p-2 bg-slate-50 dark:bg-slate-900/80 rounded-lg border border-slate-200/80 dark:border-slate-800/80 mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-emerald-500/50 text-slate-900 dark:text-slate-100 text-[10px] font-bold flex items-center justify-center font-mono">JD</div>
                  <div class="overflow-hidden">
                    <p class="font-bold text-slate-900 dark:text-slate-200 text-xs truncate">John Doe</p>
                    <p class="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">${tier.title}</p>
                  </div>
                </div>
                <div class="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
                  <span>🔥 ${profile.streak} Days active</span>
                  <span class="font-mono font-bold text-slate-800 dark:text-slate-300">${profile.xp} XP</span>
                </div>
              </div>

              <!-- Toggles & Action Links -->
              <div class="space-y-1">
                <button class="theme-toggle w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition group" title="${isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}" aria-label="Toggle theme">
                  <div class="flex items-center gap-2">
                    <span class="text-sm">${isLight ? '☀️' : '🌙'}</span>
                    <span>${isLight ? 'Light Mode' : 'Dark Mode'}</span>
                  </div>
                  <span class="text-[10.5px] text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 font-mono">${isLight ? 'Switch Dark' : 'Switch Light'}</span>
                </button>

                <button class="sound-toggle w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition group" title="${profile.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}" aria-label="Toggle sound">
                  <div class="flex items-center gap-2">
                    <span class="text-sm">${profile.soundEnabled ? '🔊' : '🔇'}</span>
                    <span>Audio FX</span>
                  </div>
                  <span class="text-[10.5px] text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 font-mono">${profile.soundEnabled ? 'On' : 'Muted'}</span>
                </button>

                <button class="nav-btn w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition group" data-view="goal" title="Goals">
                  <div class="flex items-center gap-2">
                    <span class="text-sm">🎯</span>
                    <span>Goals & Habits</span>
                  </div>
                  <span class="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">${profile.weeklyGoal ? profile.weeklyGoal.completedThisWeek || 0 : 0}/${profile.weeklyGoal ? profile.weeklyGoal.targetLessons || 5 : 5}</span>
                </button>

                <button class="search-trigger w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition group" title="Open Search (${platformShortcut.compact})">
                  <div class="flex items-center gap-2">
                    <span class="text-sm">⌨️</span>
                    <span>Command Search</span>
                  </div>
                  <kbd class="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-mono text-slate-500 dark:text-slate-400">${platformShortcut.compact}</kbd>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Floating Bottom Sticky Dock / Capsule Navbar -->
    <aside id="fin-bottom-dock-container" class="fixed bottom-5 sm:bottom-6 inset-x-0 mx-auto z-40 w-fit max-w-[calc(100vw-24px)] pointer-events-none">
      <nav class="fin-bottom-dock pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-white/92 dark:bg-[#090d14]/92 text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl select-none" aria-label="Floating Main Navigation">
        
        <!-- Left Dock Icon: Origami Logo Mark -->
        <button class="brand-logo p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer flex items-center justify-center shrink-0 group" data-view="courses" title="FinBrilliant Home">
          <svg class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="2" width="14" height="14" rx="3.5" fill="url(#finLogoGradCyan)" />
            <path d="M10 10 L16 16 L10 16 Z" fill="#042f2e" opacity="0.45" />
            <rect x="2" y="10" width="14" height="14" rx="3.5" fill="url(#finLogoGradEmerald)" filter="url(#finLogoShadow)" />
          </svg>
          <span class="sr-only">FinBrilliant</span>
        </button>

        <!-- Hairline Divider -->
        <div class="dock-divider h-4 w-[1px] bg-slate-300 dark:bg-white/15 shrink-0"></div>

        <!-- Navigation Tabs (Learn, Practice, Markets, Goals, Lab) -->
        <div class="dock-tabs-track relative flex items-center overflow-x-auto no-scrollbar">
          <!-- Dynamic Sliding Indicator Pill -->
          <div id="dock-active-pill" class="absolute pointer-events-none z-0" style="display: none;"></div>

          ${navTabs.map(item => {
            const isActive = (state.currentView === item.id) || (item.id === 'courses' && state.currentView === 'lesson');
            return `
              <button class="nav-btn relative z-10 ${isActive ? 'active-tab' : ''}" data-view="${item.id}" title="${item.title}" aria-label="${item.label} (${item.srText})">
                <span>${item.label}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Hairline Divider -->
        <div class="dock-divider h-4 w-[1px] bg-slate-300 dark:bg-white/15 shrink-0 hidden xs:block"></div>

        <!-- Quick Theme Toggle inside Bottom Dock -->
        <button class="theme-toggle p-1.5 sm:p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer flex items-center justify-center shrink-0 text-xs sm:text-sm text-slate-700 dark:text-slate-200" title="${isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}" aria-label="Toggle theme">
          <span class="select-none">${isLight ? '🌙' : '☀️'}</span>
        </button>

        <!-- Right Dock Action: Search Trigger Capsule -->
        <button class="search-trigger flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition shadow-sm cursor-pointer shrink-0 group active:scale-95" title="Search lessons, topics, or tools (${platformShortcut.compact})" aria-label="Search lessons, topics, or tools">
          <svg class="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span class="hidden md:inline font-medium text-[11.5px]">Search lessons, topics, or tools...</span>
          <span class="md:hidden font-medium text-[11.5px]">Search</span>
          <kbd class="inline-flex items-center px-1.5 py-0.2 rounded bg-slate-950/20 text-[9.5px] font-mono font-bold text-slate-950 tracking-wide shadow-2xs">${platformShortcut.label}</kbd>
        </button>

      </nav>
    </aside>

    <!-- Command Palette Search Dialog Modal -->
    <div id="palette-modal" class="hidden fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-200" role="dialog" aria-modal="true" aria-label="Command search palette">
      <div id="palette-backdrop" class="fixed inset-0"></div>
      <div class="relative w-full max-w-xl bg-white dark:bg-[#111923] border border-slate-200 dark:border-[#223041] rounded-2xl shadow-2xl overflow-hidden z-10 animate-fade-in flex flex-col max-h-[80vh]">
        <!-- Search Input Header -->
        <div class="p-3.5 border-b border-slate-200 dark:border-[#223041] flex items-center gap-3 bg-slate-50/80 dark:bg-slate-900/60">
          <svg class="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            id="palette-input" 
            type="text" 
            placeholder="Search lessons, topics, tools, or shortcuts..." 
            class="w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none font-medium"
            autocomplete="off"
            spellcheck="false"
          />
          <kbd id="palette-close-btn" class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Close (Esc)">ESC</kbd>
        </div>

        <!-- Filtered Results Container -->
        <div id="palette-results" class="p-2 overflow-y-auto max-h-[50vh] divide-y divide-slate-100 dark:divide-slate-800/40">
          <!-- Populated dynamically via JS -->
        </div>

        <!-- Palette Footer / Shortcuts Info -->
        <div class="px-3.5 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-[#223041] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <div class="flex items-center gap-2">
            <span>Navigate <kbd class="px-1 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">↑↓</kbd></span>
            <span>Select <kbd class="px-1 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">↵</kbd></span>
          </div>
          <span>FinBrilliant Quant Search</span>
        </div>
      </div>
    </div>
  `;
}
