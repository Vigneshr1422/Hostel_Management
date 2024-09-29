document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('application-form');
    const notification = document.getElementById('notification');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Show notification for loading state
        notification.textContent = 'Submitting...';
        notification.classList.add('show');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
            });

            if (response.ok) {
                notification.textContent = 'Form submitted successfully!';
            } else {
                notification.textContent = 'Form submission failed. Please try again.';
            }
        } catch (error) {
            notification.textContent = 'An error occurred. Please try again.';
        }

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    });
});
