export const Wrapper = new CjsComponent((data) => {
    const { class:className, style } = data;

    return `
        <div class="${className}" style="${style}">
            
        </div>
    `;
});

Wrapper.setDefaultData({ title: "wrapper", style: "" });
Wrapper.importStyle('./src/layouts/dashboard/_styles/Wrapper.css');