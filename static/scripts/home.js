    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) 
  
        );
    }

    // Function to add the animate class when elements are in the viewport
    function handleScroll() {
        const animateElements = document.querySelectorAll('.animate-left, .animate-right');

        animateElements.forEach((element) => {
            if (isInViewport(element)) {
                element.classList.add('animate');
            }
        });
    }

    // Listen for the scroll event and initially check if any elements are in the viewport
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);
