function copyCode(button) {
    // If button is already in "copied" state, ignore the click
    if (button.dataset.copying === 'true') {
        return;
    }

    const pre = button.previousElementSibling;
    const code = pre.querySelector('code').textContent;
    
    button.dataset.copying = 'true';
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
            button.dataset.copying = 'false';
        }, 2000);
    });
}