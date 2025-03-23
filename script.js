document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Mobile menu functionality
  const mobileMenuButton = document.querySelector(".mobile-menu-button")
  const closeMenuButton = document.querySelector(".close-menu")
  const mobileMenu = document.querySelector(".mobile-menu")
  const body = document.body

  // Create overlay element for mobile menu
  const overlay = document.createElement("div")
  overlay.className = "menu-overlay"
  body.appendChild(overlay)

  function openMobileMenu() {
    mobileMenu.classList.add("active")
    overlay.classList.add("active")
    body.style.overflow = "hidden" // Prevent scrolling when menu is open
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("active")
    overlay.classList.remove("active")
    body.style.overflow = ""
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", openMobileMenu)
  }

  if (closeMenuButton) {
    closeMenuButton.addEventListener("click", closeMobileMenu)
  }

  overlay.addEventListener("click", closeMobileMenu)

  // Smooth scrolling for all internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href")

      if (targetId === "#") return

      e.preventDefault()

      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Account for header height
          behavior: "smooth",
        })

        // Close mobile menu if open
        closeMobileMenu()
      }
    })
  })

  // Contact form handling with EmailJS
  const contactForm = document.getElementById("contact-form")
  const formSuccess = document.getElementById("form-success")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validate form
      const formInputs = contactForm.querySelectorAll("input, textarea")
      let isValid = true

      formInputs.forEach((input) => {
        if (!validateInput(input)) {
          isValid = false
        }
      })

      if (!isValid) {
        return
      }

      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]')
      const btnText = submitButton.querySelector(".btn-text")
      const btnLoading = submitButton.querySelector(".btn-loading")

      btnText.style.display = "none"
      btnLoading.style.display = "inline-block"
      submitButton.disabled = true

      // Prepare form data for EmailJS
      const templateParams = {
        name: contactForm.querySelector("#name").value,
        email: contactForm.querySelector("#email").value,
        phone: contactForm.querySelector("#phone").value,
        message: contactForm.querySelector("#message").value,
        to_email: "ghostytb77777@gmail.com", // Your email address
      }

      // Send email using EmailJS
      if (typeof emailjs !== "undefined") {
        emailjs.send("service_id", "template_id", templateParams).then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text)

            // Show success message
            contactForm.style.display = "none"
            formSuccess.style.display = "block"

            // Reset form
            contactForm.reset()

            // Reset button state
            btnText.style.display = "inline-block"
            btnLoading.style.display = "none"
            submitButton.disabled = false

            // Hide success message after 5 seconds
            setTimeout(() => {
              formSuccess.style.display = "none"
              contactForm.style.display = "grid"
            }, 5000)
          },
          (error) => {
            console.log("FAILED...", error)

            // Show error message
            alert("There was an error sending your message. Please try again later or contact us directly by phone.")

            // Reset button state
            btnText.style.display = "inline-block"
            btnLoading.style.display = "none"
            submitButton.disabled = false
          },
        )
      } else {
        console.error("EmailJS is not initialized. Make sure to include the EmailJS script in your HTML.")
        alert("EmailJS is not initialized. Please check the console for more details.")
      }
    })

    // Real-time form validation
    const formInputs = contactForm.querySelectorAll("input, textarea")

    formInputs.forEach((input) => {
      // Create validation message element
      const validationMessage = document.createElement("div")
      validationMessage.className = "validation-message"
      input.parentNode.appendChild(validationMessage)

      input.addEventListener("blur", function () {
        validateInput(this)
      })

      input.addEventListener("input", function () {
        if (this.classList.contains("invalid")) {
          validateInput(this)
        }
      })
    })

    function validateInput(input) {
      const validationMessage = input.parentNode.querySelector(".validation-message")

      if (input.required && !input.value.trim()) {
        input.classList.add("invalid")
        validationMessage.textContent = "This field is required"
        validationMessage.style.display = "block"
        return false
      }

      if (input.type === "email" && input.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(input.value)) {
          input.classList.add("invalid")
          validationMessage.textContent = "Please enter a valid email address"
          validationMessage.style.display = "block"
          return false
        }
      }

      if (input.type === "tel" && input.value.trim()) {
        const phonePattern = /^[\d\s\-$$$$]+$/
        if (!phonePattern.test(input.value)) {
          input.classList.add("invalid")
          validationMessage.textContent = "Please enter a valid phone number"
          validationMessage.style.display = "block"
          return false
        }
      }

      input.classList.remove("invalid")
      validationMessage.textContent = ""
      validationMessage.style.display = "none"
      return true
    }
  }

  // Scroll reveal animations
  const revealElements = document.querySelectorAll(
    ".section, .hero-content, .service-card, .feature, .team-member, .testimonial-card",
  )

  function revealOnScroll() {
    for (let i = 0; i < revealElements.length; i++) {
      const windowHeight = window.innerHeight
      const elementTop = revealElements[i].getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < windowHeight - elementVisible) {
        revealElements[i].classList.add("active")
      }
    }
  }

  window.addEventListener("scroll", revealOnScroll)
  revealOnScroll() // Initial check

  // Sticky header with hide/show on scroll
  const header = document.querySelector(".header")
  let lastScrollTop = 0

  function handleHeaderOnScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 100) {
      header.classList.add("sticky")

      if (scrollTop > lastScrollTop) {
        // Scrolling down
        header.classList.add("header-hidden")
      } else {
        // Scrolling up
        header.classList.remove("header-hidden")
      }
    } else {
      header.classList.remove("sticky")
      header.classList.remove("header-hidden")
    }

    lastScrollTop = scrollTop
  }

  window.addEventListener("scroll", handleHeaderOnScroll)

  // Parallax effect for hero sections
  const heroSection = document.querySelector(".hero, .page-hero")

  if (heroSection) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.pageYOffset
      heroSection.style.backgroundPositionY = scrollPosition * 0.5 + "px"
    })
  }

  // Lazy load images with fade-in effect
  const lazyImages = document.querySelectorAll("img[data-src]")

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.add("fade-in")
          imageObserver.unobserve(img)
        }
      })
    })

    lazyImages.forEach((img) => {
      imageObserver.observe(img)
    })
  } else {
    // Fallback for browsers without IntersectionObserver support
    lazyImages.forEach((img) => {
      img.src = img.dataset.src
    })
  }

  // Testimonial slider (if on testimonials page)
  const testimonialsGrid = document.querySelector(".testimonials-grid")

  if (testimonialsGrid && window.innerWidth < 768) {
    createTestimonialSlider()
  }

  function createTestimonialSlider() {
    const testimonials = Array.from(testimonialsGrid.children)
    const sliderContainer = document.createElement("div")
    sliderContainer.className = "testimonial-slider"

    const sliderTrack = document.createElement("div")
    sliderTrack.className = "slider-track"

    const prevButton = document.createElement("button")
    prevButton.className = "slider-button prev"
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>'

    const nextButton = document.createElement("button")
    nextButton.className = "slider-button next"
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>'

    const indicators = document.createElement("div")
    indicators.className = "slider-indicators"

    // Move testimonials to slider
    testimonials.forEach((testimonial, index) => {
      const slide = document.createElement("div")
      slide.className = "slider-slide"
      slide.appendChild(testimonial.cloneNode(true))
      sliderTrack.appendChild(slide)

      // Create indicator
      const indicator = document.createElement("button")
      indicator.className = "slider-indicator"
      indicator.setAttribute("data-index", index)
      if (index === 0) indicator.classList.add("active")
      indicators.appendChild(indicator)
    })

    sliderContainer.appendChild(sliderTrack)
    sliderContainer.appendChild(prevButton)
    sliderContainer.appendChild(nextButton)
    sliderContainer.appendChild(indicators)

    // Replace grid with slider
    testimonialsGrid.parentNode.replaceChild(sliderContainer, testimonialsGrid)

    // Slider functionality
    let currentSlide = 0
    const slideCount = testimonials.length

    function goToSlide(index) {
      if (index < 0) index = slideCount - 1
      if (index >= slideCount) index = 0

      sliderTrack.style.transform = `translateX(-${index * 100}%)`
      currentSlide = index

      // Update indicators
      document.querySelectorAll(".slider-indicator").forEach((indicator, i) => {
        if (i === currentSlide) {
          indicator.classList.add("active")
        } else {
          indicator.classList.remove("active")
        }
      })
    }

    prevButton.addEventListener("click", () => {
      goToSlide(currentSlide - 1)
    })

    nextButton.addEventListener("click", () => {
      goToSlide(currentSlide + 1)
    })

    // Indicator clicks
    document.querySelectorAll(".slider-indicator").forEach((indicator) => {
      indicator.addEventListener("click", () => {
        const index = Number.parseInt(indicator.getAttribute("data-index"))
        goToSlide(index)
      })
    })

    // Auto-advance slides
    let slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1)
    }, 5000)

    sliderContainer.addEventListener("mouseenter", () => {
      clearInterval(slideInterval)
    })

    sliderContainer.addEventListener("mouseleave", () => {
      slideInterval = setInterval(() => {
        goToSlide(currentSlide + 1)
      }, 5000)
    })

    // Touch support
    let touchStartX = 0
    let touchEndX = 0

    sliderTrack.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX
    })

    sliderTrack.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    })

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        // Swipe left
        goToSlide(currentSlide + 1)
      } else if (touchEndX > touchStartX + 50) {
        // Swipe right
        goToSlide(currentSlide - 1)
      }
    }
  }

  // Animated counters for statistics (if present)
  const counters = document.querySelectorAll(".counter")

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const target = Number.parseInt(counter.getAttribute("data-target"))
          let count = 0
          const updateCounter = () => {
            const increment = target / 100
            if (count < target) {
              count += increment
              counter.textContent = Math.ceil(count)
              setTimeout(updateCounter, 10)
            } else {
              counter.textContent = target
            }
          }
          updateCounter()
          counterObserver.unobserve(counter)
        }
      })
    })

    counters.forEach((counter) => {
      counterObserver.observe(counter)
    })
  }

  // Back to top button
  const backToTopButton = document.createElement("button")
  backToTopButton.className = "back-to-top"
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>'
  document.body.appendChild(backToTopButton)

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("visible")
    } else {
      backToTopButton.classList.remove("visible")
    }
  })

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // FAQ accordion (if on contact page)
  const faqItems = document.querySelectorAll(".faq-card")

  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector("h3")
      const answer = item.querySelector("p")

      // Initially hide answers
      answer.style.maxHeight = "0"
      answer.style.overflow = "hidden"
      answer.style.transition = "max-height 0.3s ease"
      answer.style.marginTop = "0"

      // Add toggle indicator
      question.innerHTML += '<span class="faq-toggle"><i class="fas fa-plus"></i></span>'
      question.style.cursor = "pointer"
      question.style.display = "flex"
      question.style.justifyContent = "space-between"
      question.style.alignItems = "center"

      question.addEventListener("click", () => {
        const isOpen = answer.style.maxHeight !== "0px"
        const toggle = question.querySelector(".faq-toggle i")

        if (isOpen) {
          answer.style.maxHeight = "0"
          answer.style.marginTop = "0"
          toggle.className = "fas fa-plus"
        } else {
          answer.style.maxHeight = answer.scrollHeight + "px"
          answer.style.marginTop = "0.75rem"
          toggle.className = "fas fa-minus"
        }
      })
    })
  }

  // Video play functionality
  const videoPlaceholder = document.querySelector(".video-placeholder")

  if (videoPlaceholder) {
    const playButton = videoPlaceholder.querySelector(".play-button")

    playButton.addEventListener("click", () => {
      // Replace placeholder with actual video
      const video = document.createElement("iframe")
      video.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" // Replace with actual video URL
      video.width = "100%"
      video.height = "100%"
      video.frameBorder = "0"
      video.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      video.allowFullscreen = true

      videoPlaceholder.innerHTML = ""
      videoPlaceholder.appendChild(video)
    })
  }

  // Add CSS for new JavaScript features
  const newStyles = document.createElement("style")
  newStyles.textContent = `
    /* Scroll reveal animations */
    .section, .hero-content, .service-card, .feature, .team-member, .testimonial-card {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .section.active, .hero-content.active, .service-card.active, .feature.active, .team-member.active, .testimonial-card.active {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Sticky header */
    .header.sticky {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }
    
    .header.header-hidden {
      transform: translateY(-100%);
    }
    
    /* Form validation */
    input.invalid, textarea.invalid {
      border-color: var(--danger) !important;
    }
    
    .validation-message {
      color: var(--danger);
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: none;
    }
    
    /* Testimonial slider */
    .testimonial-slider {
      position: relative;
      overflow: hidden;
      padding: 0 0 3rem;
    }
    
    .slider-track {
      display: flex;
      transition: transform 0.5s ease;
    }
    
    .slider-slide {
      flex: 0 0 100%;
      padding: 0 1rem;
    }
    
    .slider-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 2.5rem;
      height: 2.5rem;
      background-color: var(--white);
      border: 1px solid var(--gray);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .slider-button.prev {
      left: 0.5rem;
    }
    
    .slider-button.next {
      right: 0.5rem;
    }
    
    .slider-indicators {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .slider-indicator {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background-color: var(--gray);
      border: none;
      cursor: pointer;
    }
    
    .slider-indicator.active {
      background-color: var(--primary-color);
    }
    
    /* Back to top button */
    .back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3rem;
      height: 3rem;
      background-color: var(--primary-color);
      color: var(--white);
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    .back-to-top.visible {
      opacity: 1;
      visibility: visible;
    }
    
    .back-to-top:hover {
      background-color: var(--primary-dark);
    }
    
    /* Service tabs */
    .service-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    
    .service-tab {
      padding: 0.75rem 1.5rem;
      background-color: var(--gray-light);
      border: 1px solid var(--gray);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: var(--transition);
    }
    
    .service-tab.active {
      background-color: var(--primary-color);
      color: var(--white);
      border-color: var(--primary-color);
    }
    
    .service-content-item {
      display: none;
    }
    
    .service-content-item.active {
      display: block;
    }
    
    /* Image hover effects */
    .service-image, .team-member .member-image {
      overflow: hidden;
    }
    
    .service-image img, .team-member .member-image img {
      transition: transform 0.5s ease;
    }
    
    .service-image:hover img, .team-member:hover .member-image img {
      transform: scale(1.05);
    }
    
    /* Button hover effects */
    .btn {
      position: relative;
      overflow: hidden;
    }
    
    .btn::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.6s ease, height 0.6s ease;
    }
    
    .btn:hover::after {
      width: 300%;
      height: 300%;
    }
  `

  document.head.appendChild(newStyles)
})

