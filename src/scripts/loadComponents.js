document.addEventListener("DOMContentLoaded", function() {
    const loadComponent = (selector, url) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.querySelector(selector).innerHTML = data;
            })
            .catch(error => console.error(`Error loading component from ${url}:`, error));
    };

    // Create placeholders in the DOM
    const headerPlaceholder = document.createElement('div');
    headerPlaceholder.id = 'header-placeholder';
    document.body.prepend(headerPlaceholder);

    const footerPlaceholder = document.createElement('div');
    footerPlaceholder.id = 'footer-placeholder';
    document.body.append(footerPlaceholder);

    // Load components
    loadComponent("#header-placeholder", "components/header.html");
    loadComponent("#footer-placeholder", "components/footer.html");
});
