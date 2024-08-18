let deferredPrompt;
const installButton = document.querySelector(".install-button"); // Your install button
const iosInstallMessage = document.querySelector(".ios-install-message"); // Your iOS install message

// Handle the beforeinstallprompt event (for Android)
window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	deferredPrompt = e;
	installButton.style.display = "block";
});

installButton.addEventListener("click", (e) => {
	installButton.style.display = "none";
	deferredPrompt.prompt();
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

// Register the service worker
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

// Detect iOS and show custom install message if needed
const isIos = () => {
	const userAgent = window.navigator.userAgent.toLowerCase();
	return /iphone|ipad|ipod/.test(userAgent);
};

const isInStandaloneMode = () =>
	"standalone" in window.navigator && window.navigator.standalone;

if (isIos() && !isInStandaloneMode()) {
	iosInstallMessage.style.display = "block";
}
