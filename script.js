document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const contactForm = document.getElementById('contact-form');
    const mobileMenuToggle = document.getElementById('mobile-menu');

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const navLinks = document.querySelector('.nav-links');
    const menuToggleIcon = mobileMenuToggle.querySelector('i');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isActive = navLinks.classList.contains('active');

        // Switch Lucide icon
        if (isActive) {
            menuToggleIcon.setAttribute('data-lucide', 'x');
        } else {
            menuToggleIcon.setAttribute('data-lucide', 'menu');
        }
        if (window.lucide) window.lucide.createIcons();
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggleIcon.setAttribute('data-lucide', 'menu');
            if (window.lucide) window.lucide.createIcons();
        });
    });

    // Form Submission Handling
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service-select').value,
            message: document.getElementById('message').value
        };

        console.log('Form Submitted:', formData);

        // Show success message
        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.innerText;

        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerText = 'Enquiry Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .contact-info, .glass-form, .about-grid, .testimonial-card, .faq-item').forEach(el => {
        observer.observe(el);
    });

    // WhatsApp Widget Toggle
    const waToggle = document.getElementById('wa-toggle');
    const waMenu = document.getElementById('wa-menu');
    const waLinks = document.querySelectorAll('.wa-item-link');
    const servicesView = document.getElementById('wa-services-view');
    const chatView = document.getElementById('wa-chat-view');

    if (waToggle && waMenu) {
        waToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            waToggle.classList.toggle('active');
            waMenu.classList.toggle('active');

            // Reset to services view when closing
            if (!waMenu.classList.contains('active')) {
                setTimeout(() => {
                    servicesView.style.display = 'block';
                    chatView.style.display = 'none';
                }, 300);
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!waToggle.contains(e.target) && !waMenu.contains(e.target)) {
                waToggle.classList.remove('active');
                waMenu.classList.remove('active');
            }
        });
    }

    // Chatbot Logic
    waLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = link.innerText.trim();
            const waUrl = link.getAttribute('href');
            startChatSimulation(serviceName, waUrl);
        });
    });

    function startChatSimulation(serviceName, url) {
        servicesView.style.display = 'none';
        chatView.style.display = 'flex';
        chatView.innerHTML = '';

        // 1. User Message
        addMessage(serviceName, 'user');

        // 2. Typing
        const typing1 = showTyping();

        // 3. Agent Response 1
        setTimeout(() => {
            removeTyping(typing1);
            addMessage(`Excellent choice! We specialize in ${serviceName}. Our experts are ready to assist you.`, 'agent');

            const typing2 = showTyping();

            // 4. Agent Response 2
            setTimeout(() => {
                removeTyping(typing2);
                addMessage("Click below to connect with our team on WhatsApp and get started instantly.", 'agent');

                const btnContainer = document.createElement('div');
                btnContainer.className = 'wa-btn-container';
                btnContainer.innerHTML = `
                    <a href="${url}" target="_blank" class="wa-final-btn">
                        <i data-lucide="message-circle" style="width:18px;height:18px"></i> Continue to WhatsApp
                    </a>
                    <button class="wa-restart" id="wa-restart">
                        <i data-lucide="rotate-ccw" style="width:14px;height:14px;vertical-align:middle"></i> Back to Services
                    </button>
                `;
                chatView.appendChild(btnContainer);
                if (window.lucide) window.lucide.createIcons();

                document.getElementById('wa-restart').addEventListener('click', () => {
                    chatView.style.display = 'none';
                    servicesView.style.display = 'block';
                });
            }, 1200);
        }, 1500);
    }

    function addMessage(text, side) {
        const msg = document.createElement('div');
        msg.className = `msg ${side}`;
        msg.innerText = text;
        chatView.appendChild(msg);
        chatView.scrollTop = chatView.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'typing';
        typing.innerHTML = `Finvahan is typing <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        chatView.appendChild(typing);
        chatView.scrollTop = chatView.scrollHeight;
        return typing;
    }

    function removeTyping(el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Testimonial Slider
    const track = document.querySelector('.testimonials-track');
    const sliderDots = document.getElementById('slider-dots');
    const cards = document.querySelectorAll('.testimonial-card');

    if (track && cards.length > 0) {
        let currentIndex = 0;
        let cardsPerView = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);

        const updateDots = () => {
            if (!sliderDots) return;
            sliderDots.innerHTML = '';
            const totalDots = cards.length - cardsPerView + 1;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    clearInterval(sliderInterval);
                    goToSlide(i);
                    sliderInterval = setInterval(autoSlide, 5000);
                });
                sliderDots.appendChild(dot);
            }
        };

        const goToSlide = (index) => {
            const gap = 32; // 2rem gap
            const cardWidth = (cards[0].getBoundingClientRect().width) + gap;
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            updateDots();
        };

        const autoSlide = () => {
            currentIndex++;
            if (currentIndex > cards.length - cardsPerView) {
                currentIndex = 0;
            }
            goToSlide(currentIndex);
        };

        let sliderInterval = setInterval(autoSlide, 5000);

        // Initialize display
        updateDots();

        window.addEventListener('resize', () => {
            const newCardsPerView = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentIndex = 0;
                goToSlide(currentIndex);
            }
        });
    }
});
