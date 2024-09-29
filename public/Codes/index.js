document.addEventListener('DOMContentLoaded', function() {

    // Select all nav items
    const navItems = document.querySelectorAll('nav.navbar > ul.nav > li');

    navItems.forEach(navItem => {
        // Select all dropdown items for each nav item
        const dropdownItems = navItem.querySelectorAll('ul.dropdown > li');

        dropdownItems.forEach((dropdownItem, index) => {
            // Calculate the delay based on the index
            const delay = 0.1 + index * 0.03;

            // Apply the animation delay
            dropdownItem.style.animationDelay = delay + 's';
        });
    });
});
