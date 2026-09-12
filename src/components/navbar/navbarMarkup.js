/**
 * FinBrilliant Navbar HTML Template Generator
 * Standardized across all views (Home, Courses, Lessons, Grill, Boost, Goal, Lab)
 * in the ALL ELSE EQUAL Swiss Bauhaus financial broadsheet design system.
 */

export function getNavbarMarkup(options = {}) {
  const {
    profile = { xp: 120, streak: 3, soundEnabled: true, theme: 'dark' },
    tier = { title: 'Retail Inquirer', rank: 1, progressPct: 40 },
    isLight = (profile && profile.theme === 'light'),
    navTabs = [
      { id: 'courses', label: 'Learn', srText: 'Courses', title: 'Courses & Curricula' },
      { id: 'grill', label: 'Practice', srText: 'Grill Me', title: 'Superday Interview Practice' },
      { id: 'boost', label: 'Markets', srText: 'Daily Boost', title: 'Daily Boost & Market Dynamics' },
      { id: 'goal', label: 'Goals', srText: 'Goals', title: 'Weekly Learning Goals' },
      { id: 'lab', label: 'Lab', srText: 'Lab', title: 'Interactive Finance Sandbox' }
    ],
    progressPercent = 40,
    platformShortcut = { symbol: 'Ctrl', label: 'Ctrl K', compact: 'Ctrl+K', isMac: false },
    state = { currentView: 'courses' }
  } = options || {};

  return `
    <!-- Top Minimal Brand Header (Height: 56px, Standardized Everywhere) -->
    <header class="fin-navbar fin-top-header aee-nav-fixed sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-[#fafaf9]/90 dark:bg-[#060709]/90 backdrop-blur-md transition-colors duration-150 select-none">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        <!-- Left: Folded Origami Logo & ALL ELSE EQUAL Brand Wordmark -->
        <div class="brand-logo flex items-center gap-2.5 cursor-pointer group shrink-0" data-view="courses" title="ALL ELSE EQUAL">
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
            <span class="text-sm font-semibold tracking-[0.2em] uppercase text-slate-900 dark:text-white leading-none">ALL ELSE EQUAL</span>
            <div class="flex items-center gap-1.5 mt-1 leading-none">
              <span class="brand-text font-bold text-[10px] tracking-tight text-slate-700 dark:text-slate-300">FinBrilliant</span>
              <span class="text-[9px] text-slate-400">·</span>
              <p class="tagline-text text-[10px] text-slate-500 dark:text-slate-400 font-normal tracking-normal">First-Principles Finance</p>
            </div>
          </div>
        </div>

        <!-- Center: Primary Navigation Links (Standardized across desktop) -->
        <nav class="hidden md:flex items-center gap-5 lg:gap-6 font-mono text-xs text-slate-400">
          <button id="nav-learn-btn" class="nav-btn hover:text-slate-900 dark:hover:text-white transition cursor-pointer" data-view="courses" title="Courses">Courses</button>
          <button id="nav-explore-btn" class="nav-btn hover:text-slate-900 dark:hover:text-white transition cursor-pointer" data-view="lab" title="Lab">Lab</button>
          <button class="nav-btn hover:text-slate-900 dark:hover:text-white transition cursor-pointer" data-view="grill" title="Practice">Superday</button>
          <button class="nav-btn hover:text-slate-900 dark:hover:text-white transition cursor-pointer" data-view="boost" title="Daily Boost">Daily Boost</button>
          <button class="nav-btn hover:text-slate-900 dark:hover:text-white transition cursor-pointer" data-view="goal" title="Goals">Goals</button>
          <button id="nav-about-btn" class="hover:text-slate-900 dark:hover:text-white transition cursor-pointer hidden lg:inline">About</button>
        </nav>

        <!-- Right: XP Readout, Notification Bell, Bauhaus Theme Aperture Toggle, User Avatar JD -->
        <div class="flex items-center gap-3 shrink-0">
          <!-- XP Readout with Progress Bar directly below -->
          <div class="xp-badge flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition group" data-view="goal" title="XP Progress: ${profile.xp} XP • Rank: ${tier.title} (${progressPercent}% to next tier)">
            <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            <div class="flex flex-col justify-center text-left">
              <span class="text-[11px] font-bold font-mono text-slate-800 dark:text-slate-200 leading-none tabular-nums">${profile.xp} XP</span>
              <div class="w-[44px] h-[2.5px] bg-slate-200 dark:bg-white/15 rounded-full overflow-hidden mt-1">
                <div id="navbar-xp-fill" class="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
              </div>
            </div>
          </div>

          <!-- Vertical Hairline Divider -->
          <div class="h-4 w-[1px] bg-black/10 dark:bg-white/15 shrink-0 hidden xs:block"></div>

          <!-- Notification Bell with Status Dot -->
          <div class="relative shrink-0 flex items-center">
            <button class="bell-toggle p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer flex items-center justify-center relative" title="Notifications & System Feeds" aria-label="Notifications" aria-expanded="false">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-900 dark:bg-white ring-2 ring-[#fafaf9] dark:ring-[#060709]"></span>
            </button>

            <!-- Notification Popover Menu (Zero Emojis!) -->
            <div id="notifications-popover" class="hidden absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#fafaf9] dark:bg-[#0c0e12] border border-black/10 dark:border-white/15 rounded-xl shadow-2xl p-3 z-50 text-xs text-slate-800 dark:text-slate-200 font-mono">
              <div class="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                <span class="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">System Feeds</span>
                <span class="text-[9px] text-slate-700 dark:text-slate-300 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded border border-black/10 dark:border-white/20 uppercase font-bold">[LIVE]</span>
              </div>
              <div class="space-y-2 mt-2">
                <div class="p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 flex items-start gap-2.5 cursor-pointer hover:border-black/30 dark:hover:border-white/30 transition nav-btn" data-view="boost">
                  <span class="text-xs font-bold">[●]</span>
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-slate-200 text-[11.5px]">Daily Boost Ready</p>
                    <p class="text-[10.5px] text-slate-500 dark:text-slate-400">Claim 2X XP in today's quantitative challenge.</p>
                  </div>
                </div>
                <div class="p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 flex items-start gap-2.5 cursor-pointer hover:border-black/30 dark:hover:border-white/30 transition nav-btn" data-view="goal">
                  <span class="text-xs font-bold">[●]</span>
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-slate-200 text-[11.5px]">${profile.streak} Day Cadence Streak</p>
                    <p class="text-[10.5px] text-slate-500 dark:text-slate-400">Keep learning today to maintain your streak!</p>
                  </div>
                </div>
                <div class="p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 flex items-start gap-2.5 cursor-pointer hover:border-black/30 dark:hover:border-white/30 transition nav-btn" data-view="goal">
                  <span class="text-xs font-bold">[●]</span>
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-slate-200 text-[11.5px]">Rank Dossier: ${tier.title}</p>
                    <p class="text-[10.5px] text-slate-500 dark:text-slate-400">${profile.xp} XP total · Level ${tier.rank || 1}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Innovative Bauhaus Monochrome Aperture Theme Toggle -->
          <button id="aee-theme-toggle" class="theme-toggle aee-theme-toggle flex items-center gap-2 px-2.5 py-1 rounded-full border border-black/20 dark:border-white/20 hover:border-black/50 dark:hover:border-white/50 transition-all duration-300 group cursor-pointer" aria-label="${isLight ? 'Switch to dark theme' : 'Switch to light theme'}" title="${isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}">
            <span class="aee-theme-aperture-wrap relative w-3.5 h-3.5 flex items-center justify-center pointer-events-none">
              <svg class="aee-theme-aperture w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style="transform: ${isLight ? 'rotate(180deg)' : 'rotate(0deg)'};" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6.8" stroke="currentColor" stroke-width="1.2" />
                <path d="M 8 1.2 A 6.8 6.8 0 0 0 8 14.8 Z" fill="currentColor" />
              </svg>
            </span>
            <span id="aee-theme-label" class="font-mono text-[9.5px] tracking-[0.16em] uppercase text-slate-700 dark:text-slate-300 group-hover:text-black dark:group-hover:text-white transition-colors">
              ${isLight ? 'LIGHT' : 'DARK'}
            </span>
          </button>

          <!-- Audio FX Sound Toggle -->
          <button class="sound-toggle p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer flex items-center justify-center" title="${profile.soundEnabled ? 'Mute Audio FX' : 'Unmute Audio FX'}" aria-label="Toggle sound">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              ${profile.soundEnabled ? `
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              ` : `
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              `}
            </svg>
          </button>

          <!-- User Avatar JD & Chevron with Dropdown Menu -->
          <div class="relative shrink-0 flex items-center">
            <button class="profile-toggle flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-black/20 dark:hover:ring-white/20 transition cursor-pointer group" title="Account & Preferences: John Doe" aria-label="User profile and settings" aria-expanded="false">
              <div class="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 border border-black/15 dark:border-white/20 text-slate-900 dark:text-white text-[11px] font-bold flex items-center justify-center font-mono group-hover:border-black/40 dark:group-border-white/40 transition-colors">JD</div>
              <svg class="w-3 h-3 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-transform profile-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <!-- Profile & Settings Popover Menu (Zero Emojis!) -->
            <div id="profile-dropdown" class="hidden absolute right-0 top-full mt-2 w-64 bg-[#fafaf9] dark:bg-[#0c0e12] border border-black/10 dark:border-white/15 rounded-xl shadow-2xl p-2.5 z-50 text-xs text-slate-800 dark:text-slate-200 font-mono">
              <div class="p-2.5 bg-black/[0.02] dark:bg-white/[0.02] rounded-lg border border-black/10 dark:border-white/10 mb-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 text-slate-900 dark:text-slate-100 text-[10px] font-bold flex items-center justify-center font-mono">JD</div>
                  <div class="overflow-hidden">
                    <p class="font-bold text-slate-900 dark:text-slate-200 text-xs truncate">John Doe</p>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">${tier.title}</p>
                  </div>
                </div>
                <div class="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                  <span>${profile.streak} Days Active</span>
                  <span class="font-bold text-slate-900 dark:text-slate-100">${profile.xp} XP</span>
                </div>
              </div>

              <!-- Toggles & Action Links -->
              <div class="space-y-1">
                <button class="theme-toggle w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition group cursor-pointer" title="${isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}" aria-label="Toggle theme">
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] font-bold">[MODE]</span>
                    <span>${isLight ? 'Light Theme' : 'Dark Theme'}</span>
                  </div>
                  <span class="text-[9.5px] text-slate-500 dark:text-slate-400 group-hover:text-black dark:group-hover:text-white uppercase">${isLight ? 'Switch Dark' : 'Switch Light'}</span>
                </button>

                <button class="sound-toggle w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition group cursor-pointer" title="${profile.soundEnabled ? 'Mute Audio FX' : 'Unmute Audio FX'}" aria-label="Toggle sound">
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] font-bold">[AUDIO]</span>
                    <span>Audio FX</span>
                  </div>
                  <span class="text-[9.5px] text-slate-500 dark:text-slate-400 group-hover:text-black dark:group-hover:text-white uppercase">${profile.soundEnabled ? 'Enabled' : 'Muted'}</span>
                </button>

                <button class="nav-btn w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition group cursor-pointer" data-view="goal" title="Goals">
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] font-bold">[DOSSIER]</span>
                    <span>Goals</span>
                  </div>
                  <span class="text-[10px] text-slate-900 dark:text-slate-100 font-bold">${profile.weeklyGoal ? profile.weeklyGoal.completedThisWeek || 0 : 0}/${profile.weeklyGoal ? profile.weeklyGoal.targetLessons || 5 : 5}</span>
                </button>

                <button class="search-trigger w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition group cursor-pointer" title="Open Search (${platformShortcut.compact})">
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] font-bold">[COMMAND]</span>
                    <span>Command Search</span>
                  </div>
                  <kbd class="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-[9px] font-bold text-slate-600 dark:text-slate-400">${platformShortcut.compact}</kbd>
                </button>
              </div>
            </div>
          </div>

          <!-- Vertical Hairline Divider -->
          <div class="h-4 w-[1px] bg-black/10 dark:bg-white/15 shrink-0 hidden xl:block"></div>

          <!-- Brand Tagline Statement -->
          <span class="aee-editorial-serif text-xs text-slate-400 italic hidden xl:inline select-none">
            A more thoughtful financial future.
          </span>
        </div>
      </div>
    </header>

    <!-- Floating Bottom Sticky Dock / Capsule Navbar -->
    <aside id="fin-bottom-dock-container" class="fixed bottom-5 sm:bottom-6 inset-x-0 mx-auto z-40 w-fit max-w-[calc(100vw-24px)] pointer-events-none">
      <nav class="fin-bottom-dock pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-[#fafaf9]/92 dark:bg-[#060709]/92 text-slate-900 dark:text-white border border-black/10 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl select-none" aria-label="Floating Main Navigation">
        
        <!-- Left Dock Icon: Origami Logo Mark -->
        <button class="brand-logo p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer flex items-center justify-center shrink-0 group" data-view="courses" title="ALL ELSE EQUAL">
          <svg class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="2" width="14" height="14" rx="3.5" fill="url(#finLogoGradCyan)" />
            <path d="M10 10 L16 16 L10 16 Z" fill="#042f2e" opacity="0.45" />
            <rect x="2" y="10" width="14" height="14" rx="3.5" fill="url(#finLogoGradEmerald)" filter="url(#finLogoShadow)" />
          </svg>
          <span class="sr-only">ALL ELSE EQUAL</span>
        </button>

        <!-- Hairline Divider -->
        <div class="dock-divider h-4 w-[1px] bg-black/10 dark:bg-white/15 shrink-0"></div>

        <!-- Navigation Tabs (Learn, Practice, Markets, Goals, Lab) -->
        <div class="dock-tabs-track relative flex items-center overflow-x-auto no-scrollbar font-mono text-xs">
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
        <div class="dock-divider h-4 w-[1px] bg-black/10 dark:bg-white/15 shrink-0 hidden xs:block"></div>

        <!-- Quick Theme Toggle inside Bottom Dock -->
        <button class="theme-toggle p-1.5 sm:p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer flex items-center justify-center shrink-0 text-xs text-slate-700 dark:text-slate-200" title="${isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}" aria-label="Toggle theme">
          <span class="aee-theme-aperture-wrap relative w-3.5 h-3.5 flex items-center justify-center pointer-events-none">
            <svg class="aee-theme-aperture w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style="transform: ${isLight ? 'rotate(180deg)' : 'rotate(0deg)'};" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="6.8" stroke="currentColor" stroke-width="1.2" />
              <path d="M 8 1.2 A 6.8 6.8 0 0 0 8 14.8 Z" fill="currentColor" />
            </svg>
          </span>
        </button>

        <!-- Right Dock Action: Search Trigger Capsule -->
        <button class="search-trigger flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-semibold text-xs transition shadow-sm cursor-pointer shrink-0 group active:scale-95" title="Search lessons, topics, or tools (${platformShortcut.compact})" aria-label="Search lessons, topics, or tools">
          <svg class="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span class="hidden md:inline font-mono text-[11px] uppercase tracking-wide">Search lessons, topics, or tools...</span>
          <span class="md:hidden font-mono text-[11px] uppercase tracking-wide">Search</span>
          <kbd class="inline-flex items-center px-1.5 py-0.2 rounded bg-white/20 dark:bg-black/20 text-[9px] font-mono font-bold tracking-wider">${platformShortcut.label}</kbd>
        </button>

      </nav>
    </aside>

    <!-- Command Palette Search Dialog Modal -->
    <div id="palette-modal" class="hidden fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200" role="dialog" aria-modal="true" aria-label="Command search palette">
      <div id="palette-backdrop" class="fixed inset-0"></div>
      <div class="relative w-full max-w-xl bg-[#fafaf9] dark:bg-[#0c0e12] border border-black/15 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 animate-fade-in flex flex-col max-h-[80vh]">
        <!-- Search Input Header -->
        <div class="p-3.5 border-b border-black/10 dark:border-white/10 flex items-center gap-3 bg-black/[0.02] dark:bg-white/[0.02]">
          <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            id="palette-input" 
            type="text" 
            placeholder="Search lessons, topics, tools, or shortcuts..." 
            class="w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none font-mono"
            autocomplete="off"
            spellcheck="false"
          />
          <kbd id="palette-close-btn" class="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-[10px] font-mono text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 transition" title="Close (Esc)">ESC</kbd>
        </div>

        <!-- Filtered Results Container -->
        <div id="palette-results" class="p-2 overflow-y-auto max-h-[50vh] divide-y divide-black/5 dark:divide-white/5 font-mono text-xs">
          <!-- Populated dynamically via JS -->
        </div>

        <!-- Palette Footer / Shortcuts Info -->
        <div class="px-3.5 py-2 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <div class="flex items-center gap-2">
            <span>Navigate <kbd class="px-1 bg-black/5 dark:bg-white/10 rounded text-[10px]">↑↓</kbd></span>
            <span>Select <kbd class="px-1 bg-black/5 dark:bg-white/10 rounded text-[10px]">↵</kbd></span>
          </div>
          <span>ALL ELSE EQUAL · QUANT SEARCH</span>
        </div>
      </div>
    </div>
  `;
}

