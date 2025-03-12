document.addEventListener("DOMContentLoaded", function () {
    // QR Code Generation
    const qrcode = new QRCode(document.getElementById("qrcode"), {
        text: window.location.href,
        width: 128,
        height: 128,
    });

    // Chatbot Functionality
    const chatIcon = document.querySelector(".chat-icon");
    const chatWindow = document.querySelector(".chat-window");
    const chatMessages = document.querySelector(".chat-messages");
    const chatInput = document.getElementById("chatInput");
    const voiceButton = document.getElementById("voiceButton");
    const closeBtn = document.querySelector(".close-btn");

    // Toggle Chat Window
    chatIcon.addEventListener("click", function () {
        chatWindow.style.display = chatWindow.style.display === "block" ? "none" : "block";
    });

    closeBtn.addEventListener("click", function () {
        chatWindow.style.display = "none";
    });

    // Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            sendMessage(transcript);
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error:", event.error);
        };
    } else {
        console.warn("Speech recognition not supported in this browser.");
        voiceButton.style.display = "none";
    }

    // Text-to-Speech for Bot Responses
    const synth = window.speechSynthesis;

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        synth.speak(utterance);
    }

    // Function to get the current time and date
    function getCurrentTimeDate() {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const date = now.toLocaleDateString();
        return `Current time is ${time} and the date is ${date}.`;
    }

    // Function to fetch weather data
    async function getWeather(city) {
        try {
            const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your API key
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            if (data.weather) {
                return `The weather in ${city} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
            } else {
                return "Sorry, I couldn't fetch the weather for that location.";
            }
        } catch (error) {
            return "There was an error fetching the weather data.";
        }
    }

    // Send Message Function
    function sendMessage(message) {
        const userMessage = document.createElement("div");
        userMessage.classList.add("message", "user");
        userMessage.textContent = "You: " + message;
        chatMessages.appendChild(userMessage);

        // Bot Response
        let botResponse = getBotResponse(message);
        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot");
        botMessage.textContent = "Bot: " + botResponse;
        chatMessages.appendChild(botMessage);
        speak(botResponse);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get Bot Response
    function getBotResponse(input) {
        input = input.toLowerCase();
        if (input.includes("your name")) return "I'm the Bowie State Chatbot! 🎓";
        if (input.includes("about you")) return "I'm here to assist you with any questions about this webpage or Bowie State University.";
        if (input.includes("who is bangalie") || input.includes("summary")) {
            return "Bangalie Koroma is a Cyber Analyst and Intrusion Detection Specialist. He specializes in identifying vulnerabilities, mitigating risks, and securing digital systems. He is passionate about cybersecurity and is currently pursuing a Bachelor of Science in Health Technology and Cybersecurity at Bowie State University.";
        }
        if (input.includes("skills")) {
            return "Bangalie's skills include Intrusion Detection & Prevention, Vulnerability Assessment, Risk Mitigation, Firewall Configuration, Python Scripting, and more. Check out the 'About Me' section for details!";
        }
        if (input.includes("education")) {
            return "Bangalie is pursuing a Bachelor of Science in Health Technology and Cybersecurity at Bowie State University, expected to graduate in May 2025.";
        }
        if (input.includes("resume")) {
            return "You can download Bangalie's resume from the 'Resume' section. It includes details about his certifications, experience, and technical skills.";
        }
        if (input.includes("time") || input.includes("date")) return getCurrentTimeDate();
        if (input.includes("weather")) {
            const city = input.split("in")[1]?.trim();
            return city ? getWeather(city) : "Please specify a city.";
        }
        return "I'm not sure about that. Try asking about Bangalie's skills, education, projects, or resume!";
    }

    // Send Message on Enter
    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && chatInput.value.trim() !== "") {
            sendMessage(chatInput.value);
            chatInput.value = "";
        }
    });

    // Voice Button
    voiceButton.addEventListener("click", function () {
        if (recognition) {
            recognition.start();
        }
    });
});
