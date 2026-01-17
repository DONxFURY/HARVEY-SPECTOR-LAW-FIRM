// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Form submission
    const form = document.getElementById("lawForm");
    const responseMsg = document.getElementById("responseMsg");
    
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById("name").value.trim();
            const discord = document.getElementById("discord").value.trim();
            const caseType = document.getElementById("caseType").value;
            const caseDetails = document.getElementById("case").value.trim();
            
            // Validation
            if (!name || !discord || !caseDetails) {
                showResponse("Please fill in all required fields.", "error");
                return;
            }
            
            // Discord username validation
            if (!discord.match(/^[^#]{2,32}#[0-9]{4}$/) && !discord.match(/^[a-zA-Z0-9_]{2,32}$/)) {
                showResponse("Please enter a valid Discord username (either username#0000 or username).", "error");
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            // Prepare data for Discord webhook
            const caseTypeText = caseType ? 
                document.querySelector(`#caseType option[value="${caseType}"]`).textContent : 
                "Not specified";
                
            const content = {
                content: "**NEW LEGAL CONSULTATION REQUEST**",
                embeds: [{
                    title: "Case Submission Details",
                    color: 0xd4af37,
                    fields: [
                        {
                            name: "Client Name",
                            value: name,
                            inline: true
                        },
                        {
                            name: "Discord Contact",
                            value: discord,
                            inline: true
                        },
                        {
                            name: "Case Type",
                            value: caseTypeText,
                            inline: true
                        },
                        {
                            name: "Case Details",
                            value: caseDetails.length > 1000 ? 
                                   caseDetails.substring(0, 1000) + "... [truncated]" : 
                                   caseDetails
                        },
                        {
                            name: "Submission Time",
                            value: new Date().toLocaleString(),
                            inline: true
                        }
                    ],
                    footer: {
                        text: "Harvey Spector Law Firm - Case Management System"
                    }
                }]
            };

            const webhookURL = "https://discord.com/api/webhooks/1370296116888735744/epaPerOLsPbPZQozVebJRHaEod4TU_1a8j-_bcDSweE9ilMWi9hlBtGWVWuO3yxJXqW9";

            try {
                const response = await fetch(webhookURL, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(content)
                });

                if (response.ok) {
                    showResponse("✅ Your case has been submitted successfully. Our legal team will contact you via Discord within 2-4 hours.", "success");
                    form.reset();
                    
                    // Scroll to response message
                    responseMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (err) {
                console.error("Error submitting form:", err);
                showResponse("❌ There was an error submitting your request. Please try again or contact HarveySpector#0001 directly on Discord.", "error");
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Show response message
    function showResponse(message, type) {
        responseMsg.textContent = message;
        responseMsg.className = "response-message " + type;
        responseMsg.style.display = "block";
        
        // Auto-hide success message after 10 seconds
        if (type === "success") {
            setTimeout(() => {
                responseMsg.style.display = "none";
            }, 10000);
        }
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(13, 27, 42, 0.98)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(13, 27, 42, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Form input validation styling
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = 'var(--error)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
});
