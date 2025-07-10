### **Prompt de Directrices para Cline (Proyecto Medical Web)**

**1. Filosofía General:**
*   **Calidad y Consistencia:** El objetivo principal es mantener la alta calidad del código, la consistencia visual y la funcionalidad del sitio web `medical-web`.
*   **Buenas Prácticas:** Siempre se deben seguir las mejores prácticas de desarrollo web, incluyendo código limpio, semántico y mantenible.
*   **No Regresiones:** Cualquier cambio realizado no debe "romper" o afectar negativamente funcionalidades existentes. La estabilidad del sitio es primordial.

**2. Proceso de Trabajo (Antes de Escribir Código):**
*   **Análisis Primero:** Antes de modificar o crear cualquier archivo, analiza la estructura del proyecto. Revisa los archivos relevantes (`index.html`, `main.js`, `loadComponents.js`, etc.) para entender el contexto y la arquitectura actual.
*   **Planificación:** Propón un plan claro y conciso antes de actuar. Explica qué archivos vas a modificar y por qué.

**3. Directrices de Desarrollo:**
*   **Reutilización de Componentes:**
    *   **Identificar Oportunidades:** Si una sección o elemento se va a usar en más de una página (como la sección de "Ubicaciones"), propon la creación de un componente reutilizable.
    *   **Mecanismo de Componentes:** Utiliza el sistema actual basado en `loadComponents.js` y `data-component` para cargar componentes HTML. No dupliques código HTML si puede ser un componente.
*   **Responsividad (Responsive Design):**
    *   **Tailwind CSS:** Utiliza las clases de utilidad de Tailwind CSS para asegurar que todos los nuevos elementos y secciones sean responsivos y se vean bien en todos los tamaños de pantalla (móvil, tablet y escritorio).
    *   **Pruebas Visuales:** Después de implementar un cambio visual, sugiere una forma de verificarlo, por ejemplo, abriendo el archivo en el navegador.
*   **JavaScript:**
    *   **No Contaminar el Scope Global:** Encapsula la lógica de JavaScript en funciones. Si una función necesita ser accesible globalmente (como para el `loadComponents.js`), vincúlala explícitamente al objeto `window`.
    *   **Manejo de Eventos:** Asegúrate de que los scripts que manipulan el DOM se ejecuten después de que el contenido (incluyendo los componentes cargados dinámicamente) esté disponible.
*   **Consistencia del Código:**
    *   **Estilo:** Mantén el estilo de código existente (formato, nombres de variables, etc.).
    *   **Armonía Visual:** Asegúrate de que los nuevos componentes y estilos coincidan con la paleta de colores, tipografía y diseño general del sitio.
