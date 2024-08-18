let deferredPrompt;
const installButton = document.querySelector(".install-button"); // Assume you have a button with this class

window.addEventListener("beforeinstallprompt", (e) => {
	// Prevent the mini-infobar from appearing on mobile
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
	// Display your custom install button
	installButton.style.display = "block";
});

installButton.addEventListener("click", (e) => {
	// Hide the install promotion
	installButton.style.display = "none";
	// Show the install prompt
	deferredPrompt.prompt();
	// Wait for the user to respond to the prompt
	deferredPrompt.userChoice.then((choiceResult) => {
		if (choiceResult.outcome === "accepted") {
			console.log("User accepted the install prompt");
		} else {
			console.log("User dismissed the install prompt");
		}
		deferredPrompt = null;
	});
});

window.addEventListener("appinstalled", (evt) => {
	console.log("Sportify has been installed.");
});

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("js/service-worker.js").then(
		(registration) => {
			console.log("Service Worker registered with scope:", registration.scope);
		},
		(err) => {
			console.log("Service Worker registration failed:", err);
		}
	);
}

// Check for updates and notify users
if (navigator.serviceWorker) {
	navigator.serviceWorker.getRegistrations().then((registrations) => {
		for (let registration of registrations) {
			registration.update();
		}
	});
}

// Optionally, listen for update events
navigator.serviceWorker.addEventListener("controllerchange", () => {
	console.log(
		"Service Worker updated, please refresh the page to get the latest version."
	);
	// You might want to notify the user here
});

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.ready.then((registration) => {
		registration.onupdatefound = () => {
			const installingWorker = registration.installing;
			installingWorker.onstatechange = () => {
				if (
					installingWorker.state === "installed" &&
					navigator.serviceWorker.controller
				) {
					// New update available
					if (confirm("A new version is available. Do you want to update?")) {
						window.location.reload();
					}
				}
			};
		};
	});
}
