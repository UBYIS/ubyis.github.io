document.addEventListener('DOMContentLoaded', function() {
    // Get all pre elements
    const codeBlocks = document.querySelectorAll('pre');
    
    // Add click event listener to each pre element
    codeBlocks.forEach(function(codeBlock) {
        // Only add collapse functionality if the content height is greater than 150px
        if (codeBlock.scrollHeight > 150) {
            codeBlock.classList.add('collapsible');
            
            // Prevent scrolling when collapsed
            codeBlock.style.overflowY = 'hidden';
            
            codeBlock.addEventListener('click', function(e) {
                // Don't trigger expand/collapse when clicking copy button
                if (e.target.closest('.copy-btn')) {
                    return;
                }
                
                // Toggle the 'expanded' class
                this.classList.toggle('expanded');
                
                // Change the content of the ::after pseudo-element
                if (this.classList.contains('expanded')) {
                    this.setAttribute('data-expanded', 'true');
                    this.style.overflowY = 'auto';
                } else {
                    this.removeAttribute('data-expanded');
                    this.style.overflowY = 'hidden';
                }
            });
        }
    });
});