// Initialize variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const handColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
let colorIndex = 0;

// Initialize MediaPipe Hands
const { Hands, Camera } = require('@mediapipe/hands'); // Assuming you are using Node.js/CommonJS

const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
hands.setOptions({
    maxNumHands: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Initialize camera
const camera = new Camera(canvas, {
    onFrame: async () => {
        await hands.send({ image: canvas });
    },
    width: 640,
    height: 480
});

// Start camera
camera.start()
    .then(() => {
        console.log('Camera started successfully');
    })
    .catch(err => {
        console.error('Error starting camera:', err);
    });

// Event listener for receiving hand tracking results
hands.onResults(onHandResults);

function onHandResults(results) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            // Draw hand landmarks
            drawLandmarks(landmarks);
        }
    }
}

function drawLandmarks(landmarks) {
    for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i].x * canvas.width;
        const y = landmarks[i].y * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = handColors[colorIndex];
        ctx.fill();
    }
}
