document.addEventListener('DOMContentLoaded', async () => {
    const components = {
        'header': { path: 'components/header.html', init: 'initHeader' },
        'footer': { path: 'components/footer.html', init: null },
        'locations': { path: 'components/locations.html', init: 'initLocationsSection' }
    };

    const loadComponent = async (element) => {
        const componentName = element.dataset.component;
        const component = components[componentName];
        if (component) {
            try {
                const response = await fetch(component.path);
                const text = await response.text();
                element.outerHTML = text;
                // We need to wait for the DOM to update before initializing scripts
                // A microtask (Promise.resolve) is a good way to do this.
                await Promise.resolve(); 
                
                if (component.init && typeof window[component.init] === 'function') {
                    window[component.init]();
                }
            } catch (error) {
                console.error(`Error loading component: ${componentName}`, error);
            }
        }
    };

    const elements = Array.from(document.querySelectorAll('[data-component]'));
    const loadPromises = elements.map(el => loadComponent(el));
    
    await Promise.all(loadPromises);

    // Initialize scripts that don't depend on a specific component here
    if (document.getElementById('especialidades')) {
        window.initEspecialidadesPage();
    }
});
