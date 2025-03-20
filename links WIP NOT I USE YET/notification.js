function displayNotification(message) {
    const notificationElement = document.createElement("div");
    notificationElement.classList.add("notification-box");
    document.body.appendChild(notificationElement);

    const notificationText = document.createElement("p");
    notificationText.innerHTML = message;
    notificationElement.appendChild(notificationText);

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-btn");
    closeButton.innerHTML = "×";
    closeButton.onclick = () => closeNotification(notificationElement);
    notificationElement.appendChild(closeButton);

    const notificationStatusBar = document.createElement("div");
    notificationStatusBar.classList.add("progressbar");
    notificationElement.appendChild(notificationStatusBar);

    // Ensure progress bar starts at full width
    notificationStatusBar.style.width = "100%";

    // Force reflow before starting animation (fixes cases where animation doesn't trigger)
    notificationStatusBar.offsetWidth; // This line forces the browser to recognize the element before animating

    // Apply transition for the progress bar
    requestAnimationFrame(() => {
        notificationStatusBar.style.width = "0%";
    });

    // Set timeout to close notification after 6 seconds
    const timeout = setTimeout(() => {
        closeNotification(notificationElement);
    }, 10000);

    // Store timeout ID to clear if closed manually
    notificationElement.dataset.timeoutId = timeout;
}


function closeNotification(element) {
    clearTimeout(Number(element.dataset.timeoutId));
    element.classList.add("closing");
    element.addEventListener("animationend", () => {
        element.remove();
    });
}

// Announcement fetching
async function fetchAnnouncement() {
    try {
        const response = await fetch('/edge-api/getAnnouncement');
        if (response.ok) {
            const announcement = await response.text();
            return announcement;
        } else {
            console.error('Error fetching announcement: ', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching announcement: ', error);
        return null;
    }
}

// Announcement handler
async function handleAnnouncement() {
    const storedAnnouncement = localStorage.getItem('announcement');
    const currentAnnouncement = await fetchAnnouncement();
    if (currentAnnouncement && currentAnnouncement !== storedAnnouncement) {
        displayNotification(currentAnnouncement);
        localStorage.setItem('announcement', currentAnnouncement);
    }
}

document.addEventListener("load", handleAnnouncement());