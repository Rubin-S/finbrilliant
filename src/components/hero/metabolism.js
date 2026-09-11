/**
 * Advanced GSAP & SVG Animated Particle Conduits and Interactive Adjacency Focus
 * for Scene 4: "The Living Metabolism" Macroeconomic Network
 */
export function setupMetabolismInteractions(container) {
  if (!container || typeof container.querySelector !== 'function') return () => {};
  const scene4 = container.querySelector('#aee-scene-4');
  if (!scene4 || typeof scene4.querySelectorAll !== 'function') return () => {};

  const nodes = Array.from(scene4.querySelectorAll('.aee-node'));
  const conduits = Array.from(scene4.querySelectorAll('.aee-vector-conduit'));
  const topInjection = scene4.querySelector('.aee-top-injection');
  const marketsSub = scene4.querySelector('.aee-markets-sublist');
  const solitons = Array.from(scene4.querySelectorAll('.aee-soliton'));

  if (nodes.length === 0) return () => {};

  const gsap = (typeof window !== 'undefined' && window.gsap) ? window.gsap : null;
  const isReduced = (typeof window !== 'undefined' && (
    window.__FIN_REDUCE_MOTION === true ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('finbrilliant_reduce_motion') === 'true')
  ));

  // If reduced motion is requested, disable animations and hide solitons
  if (isReduced) {
    solitons.forEach((s) => {
      if (s && s.style) s.style.display = 'none';
      const anim = s ? s.querySelector('animateMotion') : null;
      if (anim && typeof anim.remove === 'function') {
        anim.remove();
      }
    });
  }

  // Initialize GSAP MotionPath for solitons if available and motion is permitted
  const particleTimelines = [];
  if (gsap && !isReduced) {
    const motionPlugin = (typeof window !== 'undefined' && window.MotionPathPlugin)
      ? window.MotionPathPlugin
      : (gsap.plugins && gsap.plugins.motionPath ? gsap.plugins.motionPath : null);

    if (motionPlugin && typeof gsap.registerPlugin === 'function') {
      try {
        gsap.registerPlugin(motionPlugin);
      } catch (e) {
        // Fallback gracefully if already registered
      }
    }

    const hasMotionPlugin = Boolean(
      motionPlugin ||
      (gsap.plugins && gsap.plugins.motionPath) ||
      (typeof window !== 'undefined' && window.MotionPathPlugin)
    );

    if (hasMotionPlugin) {
      solitons.forEach((soliton) => {
        if (!soliton || typeof soliton.getAttribute !== 'function') return;
        const trackId = soliton.getAttribute('data-soliton-for');
        if (!trackId) return;
        const trackEl = scene4.querySelector(`#${trackId}`);
        if (!trackEl) return;

        // Remove SVG fallback animateMotion to give GSAP 100% lifecycle control
        const svgAnim = soliton.querySelector('animateMotion');
        if (svgAnim && typeof svgAnim.remove === 'function') {
          svgAnim.remove();
        }

        const dur = parseFloat(soliton.getAttribute('data-duration')) || 2.5;
        try {
          const tl = gsap.to(soliton, {
            motionPath: {
              path: trackEl,
              align: trackEl,
              alignOrigin: [0.5, 0.5],
              autoRotate: false
            },
            duration: dur,
            repeat: -1,
            ease: 'none'
          });
          particleTimelines.push(tl);
        } catch (e) {
          // Keep fallback if motionPath throws
        }
      });
    }
  }

  // Pre-calculate adjacency graph to guarantee zero layout thrashing on hover
  const nodesMap = new Map();
  nodes.forEach((n) => {
    if (!n || typeof n.getAttribute !== 'function') return;
    const key = n.getAttribute('data-node');
    if (key) {
      nodesMap.set(key, {
        el: n,
        box: n.querySelector('.aee-node-box')
      });
    }
  });

  const conduitItems = conduits.map((c) => ({
    el: c,
    from: (c && typeof c.getAttribute === 'function') ? c.getAttribute('data-from') : null,
    to: (c && typeof c.getAttribute === 'function') ? c.getAttribute('data-to') : null
  }));

  const adjacencyMap = new Map();
  nodesMap.forEach((_, key) => {
    const incident = [];
    const unrelated = [];
    const neighbors = new Set([key]);

    conduitItems.forEach((item) => {
      if (item.from === key || item.to === key) {
        incident.push(item.el);
        if (item.from) neighbors.add(item.from);
        if (item.to) neighbors.add(item.to);
      } else {
        unrelated.push(item.el);
      }
    });

    adjacencyMap.set(key, {
      incidentConduits: incident,
      unrelatedConduits: unrelated,
      neighborKeys: neighbors
    });
  });

  // Register interactive adjacency focus events
  const listeners = [];

  nodesMap.forEach(({ el, box }, key) => {
    const adj = adjacencyMap.get(key);
    if (!adj || !el || typeof el.addEventListener !== 'function') return;

    const onEnter = () => {
      // 1. Focused node highlight
      if (gsap) {
        gsap.to(el, { opacity: 1.0, duration: isReduced ? 0 : 0.22, overwrite: 'auto' });
        if (box) {
          gsap.to(box, {
            stroke: '#ffffff',
            fill: 'rgba(255, 255, 255, 0.12)',
            duration: isReduced ? 0 : 0.22,
            overwrite: 'auto'
          });
        }
      } else {
        el.style.opacity = '1.0';
        if (box) {
          box.style.stroke = '#ffffff';
          box.style.fill = 'rgba(255, 255, 255, 0.12)';
        }
      }
      if (el.classList && typeof el.classList.add === 'function') {
        el.classList.add('is-focused');
        el.classList.remove('is-dimmed');
      }

      // 2. Neighbor nodes vs unrelated nodes
      nodesMap.forEach((targetNode, targetKey) => {
        if (targetKey === key) return;
        const isNeighbor = adj.neighborKeys.has(targetKey);
        const targetOpacity = isNeighbor ? 0.9 : 0.15;
        const targetStroke = isNeighbor ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.15)';

        if (gsap) {
          gsap.to(targetNode.el, { opacity: targetOpacity, duration: isReduced ? 0 : 0.22, overwrite: 'auto' });
          if (targetNode.box) {
            gsap.to(targetNode.box, {
              stroke: targetStroke,
              fill: '#060709',
              duration: isReduced ? 0 : 0.22,
              overwrite: 'auto'
            });
          }
        } else {
          targetNode.el.style.opacity = String(targetOpacity);
          if (targetNode.box) {
            targetNode.box.style.stroke = targetStroke;
            targetNode.box.style.fill = '#060709';
          }
        }

        if (targetNode.el.classList && typeof targetNode.el.classList.add === 'function') {
          if (isNeighbor) {
            targetNode.el.classList.remove('is-dimmed', 'is-focused');
          } else {
            targetNode.el.classList.add('is-dimmed');
            targetNode.el.classList.remove('is-focused');
          }
        }
      });

      // 3. Incident conduits illuminate in high contrast
      adj.incidentConduits.forEach((c) => {
        if (c.classList && typeof c.classList.add === 'function') {
          c.classList.add('is-highlighted');
          c.classList.remove('is-dimmed');
        }
        if (gsap) {
          gsap.to(c, { opacity: 1.0, duration: isReduced ? 0 : 0.22, overwrite: 'auto' });
        } else {
          c.style.opacity = '1.0';
        }
      });

      // 4. Unrelated conduits gracefully dim to 0.15
      adj.unrelatedConduits.forEach((c) => {
        if (c.classList && typeof c.classList.add === 'function') {
          c.classList.remove('is-highlighted');
          c.classList.add('is-dimmed');
        }
        if (gsap) {
          gsap.to(c, { opacity: 0.15, duration: isReduced ? 0 : 0.22, overwrite: 'auto' });
        } else {
          c.style.opacity = '0.15';
        }
      });

      // 5. Contextual bus lines
      if (topInjection) {
        const topOp = (key === 'households') ? 0.8 : 0.15;
        if (gsap) {
          gsap.to(topInjection, { opacity: topOp, duration: isReduced ? 0 : 0.22, overwrite: 'auto' });
        } else {
          topInjection.style.opacity = String(topOp);
        }
      }
      if (marketsSub) {
        const mktOp = (key === 'markets') ? 1.0 : 0.15;
        if (gsap) {
          gsap.to(marketsSub, { opacity: mktOp, duration: isReduced ? 0 : 0.22, overwrite: 'auto' });
        } else {
          marketsSub.style.opacity = String(mktOp);
        }
      }
    };

    const onLeave = () => {
      // Restore all nodes to baseline resting state
      nodesMap.forEach(({ el: nodeEl, box: nodeBox }) => {
        if (nodeEl.classList && typeof nodeEl.classList.remove === 'function') {
          nodeEl.classList.remove('is-focused', 'is-dimmed');
        }
        if (gsap) {
          gsap.to(nodeEl, { opacity: 1.0, duration: isReduced ? 0 : 0.32, ease: 'power2.out', overwrite: 'auto' });
          if (nodeBox) {
            gsap.to(nodeBox, {
              stroke: 'rgba(255, 255, 255, 0.25)',
              fill: '#060709',
              duration: isReduced ? 0 : 0.32,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        } else {
          nodeEl.style.opacity = '1.0';
          if (nodeBox) {
            nodeBox.style.stroke = 'rgba(255, 255, 255, 0.25)';
            nodeBox.style.fill = '#060709';
          }
        }
      });

      // Restore all conduits to baseline resting state
      conduits.forEach((c) => {
        if (c.classList && typeof c.classList.remove === 'function') {
          c.classList.remove('is-highlighted', 'is-dimmed');
        }
        if (gsap) {
          gsap.to(c, { opacity: 1.0, duration: isReduced ? 0 : 0.32, ease: 'power2.out', overwrite: 'auto' });
        } else {
          c.style.opacity = '1.0';
        }
      });

      if (topInjection) {
        if (gsap) {
          gsap.to(topInjection, { opacity: 1.0, duration: isReduced ? 0 : 0.32, ease: 'power2.out', overwrite: 'auto' });
        } else {
          topInjection.style.opacity = '1.0';
        }
      }
      if (marketsSub) {
        if (gsap) {
          gsap.to(marketsSub, { opacity: 1.0, duration: isReduced ? 0 : 0.32, ease: 'power2.out', overwrite: 'auto' });
        } else {
          marketsSub.style.opacity = '1.0';
        }
      }
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('focus', onEnter);
    el.addEventListener('blur', onLeave);

    listeners.push({ el, event: 'mouseenter', handler: onEnter });
    listeners.push({ el, event: 'mouseleave', handler: onLeave });
    listeners.push({ el, event: 'focus', handler: onEnter });
    listeners.push({ el, event: 'blur', handler: onLeave });
  });

  return () => {
    // Teardown all GSAP particle timelines
    particleTimelines.forEach((tl) => {
      try {
        tl.kill();
      } catch (e) {}
    });
    particleTimelines.length = 0;

    // Kill any in-flight hover or leave tweens on nodes and conduits
    if (gsap && typeof gsap.killTweensOf === 'function') {
      nodes.forEach((n) => {
        try {
          gsap.killTweensOf(n);
          const box = n.querySelector('.aee-node-box');
          if (box) gsap.killTweensOf(box);
        } catch (e) {}
      });
      conduits.forEach((c) => {
        try {
          gsap.killTweensOf(c);
        } catch (e) {}
      });
      if (topInjection) {
        try {
          gsap.killTweensOf(topInjection);
        } catch (e) {}
      }
      if (marketsSub) {
        try {
          gsap.killTweensOf(marketsSub);
        } catch (e) {}
      }
    }

    // Teardown all event listeners
    listeners.forEach(({ el, event, handler }) => {
      try {
        el.removeEventListener(event, handler);
      } catch (e) {}
    });
    listeners.length = 0;
  };
}
