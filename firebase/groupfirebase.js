import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCis188btD42eOizSVu2DLanPlWMgOkTVw",
    authDomain: "accesstopyqs-a3387.firebaseapp.com",
    databaseURL: "https://accesstopyqs-a3387-default-rtdb.firebaseio.com",
    projectId: "accesstopyqs-a3387",
    storageBucket: "accesstopyqs-a3387.appspot.com",
    messagingSenderId: "256467888726",
    appId: "1:256467888726:web:1c24cc1bedcffad9b3a9f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

(async function () {

    async function checkRegistration(accessKey) {
        console.log("Checking registration status in Firebase...");
        try {
            const dbRef = ref(db, `accessKeys/${accessKey}`);
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
                console.log(`Access key verified for user: ${snapshot.val()}`);
                return true;
            } else {
                console.log('Access key not found in Firebase.');
                return false;
            }
        } catch (error) {
            console.error('Error checking registration in Firebase:', error);
            return false;
        }
    }


    const currentTime = new Date().getTime();
    console.log("Current time:", currentTime);

    const accessKey = localStorage.getItem('accessKey');
    const lastCheckTime = localStorage.getItem('lastCheckTime');
    console.log("Access Key:", accessKey);
    console.log("Last Check Time:", lastCheckTime);

    if (accessKey) {
        console.log("Access Key found in local storage.");

        const checkInterval = 86400000;

        if (!lastCheckTime || (currentTime - lastCheckTime < checkInterval)) {
            console.log("First access or check interval not reached; showing content.");


            if (!lastCheckTime) {
                console.log("First access detected. Setting lastCheckTime.");
                localStorage.setItem('lastCheckTime', currentTime);
            }


            document.getElementById('initialLoading').style.display = 'none';

        } else {

            console.log("Interval reached; verifying with Firebase.");
            const isRegistered = await checkRegistration(accessKey);
            if (isRegistered) {
                console.log("User is registered, showing content and updating lastCheckTime.");
                document.getElementById('initialLoading').style.display = 'none';

                localStorage.setItem('lastCheckTime', currentTime);
            } else {
                console.log("User not registered, redirecting to Authentication.html.");
                window.location.href = 'Authentication.html';
            }
        }
    } else {
        console.log("No access key found in local storage, redirecting to Authentication.html.");
        window.location.href = 'Authentication.html';
    }
})();
