document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling & Active Nav Link
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const header = document.querySelector('.main-header');
    const headerHeight = header.offsetHeight; // Get header height for offset

    const observerOptions = {
        root: null,
        rootMargin: `-${headerHeight}px 0px 0px 0px`, // Offset for fixed header
        threshold: 0.5 // When 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;

                // Remove 'active' from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add 'active' to the corresponding nav link
                const activeLink = document.querySelector(`.nav-link[data-section="${currentSectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }

                // Add 'active' to the section for animation
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - headerHeight + 1, // Adjust for fixed header
                behavior: 'smooth'
            });

            // Close mobile menu after clicking
            const mainNav = document.querySelector('.main-nav');
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    // Removed Dark Mode Toggle functionality

    // Scroll-to-Top Button
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Carousel Functionality
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const carouselDotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;
    // Ensure carouselItems[0] exists before accessing clientWidth
    const itemWidth = carouselItems.length > 0 ? carouselItems[0].clientWidth : 0; 

    // Create dots
    carouselItems.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        carouselDotsContainer.appendChild(dot);
    });

    const carouselDots = document.querySelectorAll('.carousel-dot');

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

        // Update active dot
        carouselDots.forEach(dot => dot.classList.remove('active'));
        if (carouselDots[currentIndex]) { // Ensure dot exists
            carouselDots[currentIndex].classList.add('active');
        }
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    carouselDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentIndex = parseInt(e.target.dataset.index);
            updateCarousel();
        });
    });

    // Form Validation
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formStatus = document.getElementById('form-status');

    function validateInput(input, errorElement, validationFn) {
        if (!validationFn(input.value.trim())) {
            input.classList.add('invalid');
            errorElement.textContent = `Please enter a valid ${input.name}.`;
            return false;
        } else {
            input.classList.remove('invalid');
            errorElement.textContent = '';
            return true;
        }
    }

    function isValidEmail(email) {
        // Basic email regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isNotEmpty(value) {
        return value.length > 0;
    }

    nameInput.addEventListener('input', () => validateInput(nameInput, nameError, isNotEmpty));
    emailInput.addEventListener('input', () => validateInput(emailInput, emailError, isValidEmail));
    messageInput.addEventListener('input', () => validateInput(messageInput, messageError, isNotEmpty));

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateInput(nameInput, nameError, isNotEmpty);
        const isEmailValid = validateInput(emailInput, emailError, isValidEmail);
        const isMessageValid = validateInput(messageInput, messageError, isNotEmpty);

        if (isNameValid && isEmailValid && isMessageValid) {
            formStatus.textContent = 'Message sent successfully!';
            formStatus.style.color = 'green';
            contactForm.reset(); // Clear the form
            // In a real application, you would send this data to a server here.
            console.log('Form Submitted:', {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            });
        } else {
            formStatus.textContent = 'Please correct the errors in the form.';
            formStatus.style.color = 'red';
        }
    });

    // Initial check for section visibility on load (for animation)
    // This makes sure the first section is visible immediately
    const firstSection = document.querySelector('.section');
    if (firstSection) {
        firstSection.classList.add('active');
    }
});