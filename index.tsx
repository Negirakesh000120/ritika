// Fix: Declare global GSAP variables to resolve "Cannot find name" errors.
declare var gsap: any;
declare var ScrollTrigger: any;
declare var CustomEase: any;
declare var SplitText: any;
declare var DrawSVGPlugin: any;

async function loadComponents() {
    const componentPlaceholders = document.querySelectorAll('[data-component]');
    const fetchPromises = Array.from(componentPlaceholders).map(async (placeholder) => {
        const path = placeholder.getAttribute('data-component');
        if (path) {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    if (response.status === 404) {
                        console.error(`Component not found: ${path}`);
                        placeholder.innerHTML = `<p style="color:red;">Error: Component not found (${path})</p>`;
                        return;
                    }
                    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
                }
                const html = await response.text();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                // Replace placeholder with the fetched content's children
                // to avoid adding an extra div layer.
                placeholder.replaceWith(...tempDiv.childNodes);
            } catch (error) {
                console.error(`Error loading component: ${path}`, error);
                placeholder.innerHTML = `<p style="color:red;">Error loading content: ${error.message}</p>`;
            }
        }
    });
    await Promise.all(fetchPromises);
}

function initializeAnimations() {
    // ------- Register Plugins ------- //
    gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, DrawSVGPlugin);

    // ------- Register Custom Eases ------- //
    CustomEase.create("default", "0.625, 0.05, 0, 1");
    CustomEase.create("subtle", "0.16, 1, 0.3, 1");

    const eases = {
        default: "default",
        subtle: "subtle"
    };

    // ------- Load Animations ------- //
    function initLoadAnimations() {
        const tl = gsap.timeline();

        // --- CLIP PATH --- //
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-animate="clip-path-load"]').forEach((el: HTMLElement) => {
            gsap.set(el, {
                autoAlpha: 1,
                clipPath: "inset(100% 0% 0% 0%)"
            });

            tl.to(el, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.5,
                ease: eases.default
            }, 0);
        }
        );

        // --- IMAGE SCALE (sync with clip-path) --- //
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-animate="image-scale"]').forEach((el: HTMLElement) => {
            gsap.set(el, {
                autoAlpha: 1,
                scale: 1.2
            });
            tl.to(el, {
                scale: 1,
                duration: 1.5,
                ease: eases.default
            }, 0);
        }
        );

        const startTime = 0.5;

        // --- LINE WIDTH --- //
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-animate="lines-load"]').forEach((el: HTMLElement) => {
            gsap.set(el, {
                autoAlpha: 1,
                width: "0%"
            });
            tl.to(el, {
                width: "100%",
                duration: 1.5,
                ease: eases.subtle
            }, startTime);
        }
        );

        // --- FADE LOAD --- //
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-animate="fade-load"]').forEach((el: HTMLElement) => {
            gsap.set(el, {
                autoAlpha: 0,
                yPercent: 100
            });
            tl.to(el, {
                autoAlpha: 1,
                yPercent: 0,
                duration: 1.5,
                ease: eases.subtle
            }, startTime);
        }
        );

        // --- SPLIT LINES --- //
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-split="lines-load"]').forEach((el: HTMLElement) => {
            gsap.set(el, {
                autoAlpha: 1,
                willChange: "transform",
                transform: "translateZ(0)"
            });

            const split = SplitText.create(el, {
                type: "lines",
                linesClass: "line",
                autoSplit: true,
                mask: "lines"
            });

            // Fix: Add type to forEach callback parameter to enable type checking.
            split.lines.forEach((line: HTMLElement) => {
                line.style.willChange = "transform";
                line.style.transform = "translateZ(0)";
            }
            );

            tl.from(split.lines, {
                duration: 1.5,
                yPercent: 160,
                stagger: 0.1,
                ease: eases.subtle
            }, startTime);
        }
        );

        // --- SPLIT LETTERS --- //
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-split="letters-load"]').forEach((el: HTMLElement) => {
            gsap.set(el, {
                autoAlpha: 1
            });

            const split = SplitText.create(el, {
                type: "lines,words,chars",
                linesClass: "display",
                autoSplit: true,
                mask: "lines"
            });

            gsap.set(split.chars, {
                autoAlpha: 0,
                yPercent: 200
            });

            // Fix: Add type to forEach callback parameter to enable type checking.
            split.chars.forEach((char: HTMLElement) => {
                char.style.willChange = "transform";
                char.style.transform = "translateZ(0)";
            }
            );

            tl.to(split.chars, {
                autoAlpha: 1,
                yPercent: 0,
                stagger: 0.03,
                duration: 1.5,
                ease: eases.subtle
            }, startTime);
        }
        );

        // --- STAGGERED CHILDREN --- //
        // Fix: Add type to forEach callback parameter and cast children to resolve style property access error.
        gsap.utils.toArray('[data-animate="stagger-children-load"]').forEach((group: HTMLElement) => {
            const children = Array.from(group.children) as HTMLElement[];
            gsap.set(group, {
                autoAlpha: 1
            });
            gsap.set(children, {
                opacity: 0,
                yPercent: 150
            });

            children.forEach(child => {
                child.style.willChange = "transform";
                child.style.transform = "translateZ(0)";
            }
            );

            tl.to(children, {
                opacity: 1,
                yPercent: 0,
                duration: 1.5,
                ease: eases.subtle,
                stagger: 0.08
            }, startTime);
        }
        );
    }

    // ------- Scroll Animations ------- //
    function initScrollAnimations() {
        // SPLIT LINES
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-split="lines-scroll"]').forEach((el: HTMLElement) => {
            const split = SplitText.create(el, {
                type: "lines",
                linesClass: "line",
                autoSplit: true,
                mask: "lines"
            });

            // Fix: Add type to forEach callback parameter to enable type checking.
            split.lines.forEach((line: HTMLElement) => {
                line.style.transform = "translateZ(0)";
                line.style.willChange = "transform";
            }
            );

            gsap.from(split.lines, {
                yPercent: 120,
                stagger: 0.1,
                duration: 1.5,
                ease: eases.subtle,
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    once: true
                }
            });
        }
        );

        // SPLIT HEADINGS (LINES)
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-split="heading-scroll"]').forEach((el: HTMLElement) => {
            const split = SplitText.create(el, {
                type: "lines",
                linesClass: "display",
                autoSplit: true,
                mask: "lines"
            });

            // Fix: Add type to forEach callback parameter to enable type checking.
            split.lines.forEach((line: HTMLElement) => {
                line.style.transform = "translateZ(0)";
                line.style.willChange = "transform";
            }
            );

            gsap.from(split.lines, {
                yPercent: 120,
                stagger: 0.1,
                duration: 1.75,
                ease: eases.subtle,
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    once: true
                }
            });
        }
        );

        // SPLIT HEADINGS (LETTERS)
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-split="letters-scroll"]').forEach((el: HTMLElement) => {
            const split = SplitText.create(el, {
                type: "lines,words,chars",
                linesClass: "display",
                autoSplit: true,
                mask: "lines"
            });

            // Fix: Add type to forEach callback parameter to enable type checking.
            split.chars.forEach((char: HTMLElement) => {
                char.style.transform = "translateZ(0)";
                char.style.willChange = "transform";
            }
            );

            gsap.from(split.chars, {
                yPercent: 100,
                opacity: 0,
                stagger: 0.03,
                duration: 1.5,
                ease: eases.subtle,
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    once: true
                }
            });
        }
        );

        // CTA TEXT
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-split="cta-scroll"]').forEach((el: HTMLElement) => {
            const split = SplitText.create(el, {
                type: "lines,words,chars",
                linesClass: "display",
                autoSplit: true,
                mask: "lines"
            });

            // Fix: Add type to forEach callback parameter to enable type checking.
            split.chars.forEach((char: HTMLElement) => {
                char.style.transform = "translateZ(0)";
                char.style.willChange = "transform";
            }
            );

            gsap.from(split.chars, {
                yPercent: 100,
                opacity: 0,
                stagger: 0.03,
                duration: 1.5,
                ease: eases.subtle,
                scrollTrigger: {
                    trigger: el,
                    start: "top 75%",
                    once: true
                }
            });
        }
        );

        // STAGGERED CHILDREN
        // Fix: Add type to forEach callback parameter and cast children to resolve style property access error.
        gsap.utils.toArray('[data-animate="stagger-children"]').forEach((group: HTMLElement) => {
            const children = Array.from(group.children) as HTMLElement[];

            children.forEach(child => {
                child.style.transform = "translateZ(0)";
                child.style.willChange = "transform";
            }
            );

            gsap.set(children, {
                opacity: 0,
                yPercent: 100
            });

            gsap.to(children, {
                opacity: 1,
                yPercent: 0,
                duration: 1.5,
                ease: eases.subtle,
                stagger: 0.04,
                scrollTrigger: {
                    trigger: group,
                    start: "top 90%",
                    once: true
                }
            });
        }
        );

        // CLIP PATH
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-animate="clip-path"]').forEach((el: HTMLElement) => {
            gsap.set(el, {
                clipPath: "inset(100% 0% 0% 0%)"
            });

            gsap.to(el, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.2,
                ease: eases.subtle,
                scrollTrigger: {
                    trigger: el,
                    start: "top 99%",
                    once: true
                }
            });
        }
        );

        // LINE WIDTH
        // Fix: Add type to forEach callback parameter to enable type checking.
        gsap.utils.toArray('[data-animate="lines"]').forEach((el: HTMLElement) => {
            gsap.set(el, {
                width: "0%"
            });

            gsap.to(el, {
                width: "100%",
                duration: 1.2,
                ease: eases.subtle,
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    once: true
                }
            });
        }
        );
    }
    
    initLoadAnimations();
    initScrollAnimations();
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadComponents();
    // Initialize interactive behaviors that require loaded components
    setupServiceAccordion();
    // Now that components are loaded and in the DOM,
    // we can wait for fonts and then initialize the animations.
    document.fonts.ready.then(() => {
        initializeAnimations();
    });
});

// ------- Services Accordion (Branding / Web design / Development) ------- //
function setupServiceAccordion() {
    const serviceItems = Array.from(document.querySelectorAll('.service-item')) as HTMLElement[];
    if (serviceItems.length === 0) {
        return;
    }

    const closeItem = (item: HTMLElement) => {
        const body = item.querySelector('.service-item-body') as HTMLElement | null;
        const grid = item.querySelector('.service-item-grid') as HTMLElement | null;
        if (!body) return;
        body.style.overflow = 'hidden';
        // Animate collapse
        if (typeof gsap !== 'undefined') {
            gsap.to(body, { height: 0, duration: 0.4, ease: 'subtle' });
            if (grid) {
                gsap.to(grid, { opacity: 0, y: '4rem', duration: 0.35, ease: 'subtle' });
            }
        } else {
            body.style.height = '0px';
            if (grid) {
                grid.style.opacity = '0';
                grid.style.transform = 'translate3d(0, 4rem, 0)';
            }
        }
        item.classList.remove('is-open');
    };

    const openItem = (item: HTMLElement) => {
        const body = item.querySelector('.service-item-body') as HTMLElement | null;
        const grid = item.querySelector('.service-item-grid') as HTMLElement | null;
        if (!body) return;
        body.style.overflow = 'hidden';
        const targetHeight = getAutoHeight(body);
        // Animate expand
        if (typeof gsap !== 'undefined') {
            gsap.to(body, { height: targetHeight, duration: 0.45, ease: 'subtle' });
            if (grid) {
                gsap.to(grid, { opacity: 1, y: '0rem', duration: 0.45, ease: 'subtle' });
            }
        } else {
            body.style.height = targetHeight;
            if (grid) {
                grid.style.opacity = '1';
                grid.style.transform = 'translate3d(0, 0rem, 0)';
            }
        }
        item.classList.add('is-open');
    };

    const getAutoHeight = (element: HTMLElement): string => {
        const previousHeight = element.style.height;
        element.style.height = 'auto';
        const computedHeight = window.getComputedStyle(element).height;
        element.style.height = previousHeight;
        return computedHeight;
    };

    // Initialize all as closed (matches current inline height:0 in HTML)
    serviceItems.forEach(item => closeItem(item));

    // Optional: open the first item by default if it has class 'first-item'
    const firstOpen = serviceItems.find(item => item.classList.contains('first-item'));
    if (firstOpen) {
        openItem(firstOpen);
    }

    serviceItems.forEach(item => {
        const header = item.querySelector('.service-item-header');
        if (!header) return;
        header.addEventListener('click', (event: Event) => {
            event.preventDefault();
            const isOpen = item.classList.contains('is-open');
            // Close others for an accordion effect
            serviceItems.forEach(other => {
                if (other !== item) closeItem(other);
            });
            if (isOpen) {
                closeItem(item);
            } else {
                openItem(item);
            }
        });
    });
}
