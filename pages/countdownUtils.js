import React, { useState, useEffect } from 'react';

// Your Countdown Timer component
export const CountdownTimer = ({ initialDuration }) => {
    const [duration, setDuration] = useState(initialDuration);
    const [timeUnits, setTimeUnits] = useState([]);
    const [notificationShown, setNotificationShown] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setDuration((prevDuration) => {
                if (prevDuration > 0) {
                    if (prevDuration === 10 && !notificationShown) {
                        // Notify user, play sound, and show styled notification when 10 seconds remaining
                        showStyledNotification();
                        playNotificationSound();
                        setNotificationShown(true);
                    }
                    return prevDuration - 1;
                }
                return prevDuration;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [notificationShown]);

    useEffect(() => {
        // Determine the initial time units based on the duration
        const initialTimeUnits = getInitialTimeUnits(initialDuration);
        setTimeUnits(initialTimeUnits);
    }, [initialDuration]);

    useEffect(() => {
        // Reset notificationShown when the countdown is restarted
        setNotificationShown(false);
    }, [duration]);

    // Function to determine initial time units based on the duration
    const getInitialTimeUnits = (duration) => {
        if (duration >= 24 * 60 * 60) {
            return ['days', 'hours', 'minutes', 'seconds'];
        } else if (duration >= 60 * 60) {
            return ['hours', 'minutes', 'seconds'];
        } else if (duration >= 60) {
            return ['minutes', 'seconds'];
        } else {
            return ['seconds'];
        }
    };

    // Function to get the formatted time
    const getFormattedTime = () => {
        let remainingTime = duration;
        return timeUnits.map((unit) => {
            const unitValue = Math.floor(remainingTime / getTimeUnitInSeconds(unit));
            remainingTime %= getTimeUnitInSeconds(unit);
            return (
                <div key={unit} className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content text-center items-center">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ '--value': unitValue }}>{unitValue}</span>
                    </span>
                    {unit}
                </div>
            );
        });
    };

    // Function to convert time unit to seconds
    const getTimeUnitInSeconds = (unit) => {
        switch (unit) {
            case 'days':
                return 24 * 60 * 60;
            case 'hours':
                return 60 * 60;
            case 'minutes':
                return 60;
            case 'seconds':
                return 1;
            default:
                return 1;
        }
    };

    return (
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            {getFormattedTime()}
        </div>
    );
};

// Function to play notification sound
export const playNotificationSound = () => {
    // Replace 'path/to/your/custom/sound.mp3' with the actual path to your custom sound file
    const soundFilePath = '/notification.wav';

    if (window.AudioContext || window.webkitAudioContext) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioElement = new Audio(soundFilePath);

        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(audioContext.destination);

        audioElement.play().catch(error => {
            console.error('Error playing audio:', error.message);
        });
    }
};

export const showStyledNotification = () => {
    const title = 'Hurry up!';
    const message = 'Only 10 seconds remaining!';

    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'bg-red-500 text-white p-4 fixed rounded-md shadow-md';
    notificationContainer.style.top = '16px'; // Adjust top position with margin
    notificationContainer.style.right = '16px'; // Set right position with margin

    const titleElement = document.createElement('div');
    titleElement.className = 'font-bold';
    titleElement.innerText = title;

    const messageElement = document.createElement('div');
    messageElement.innerText = message;

    notificationContainer.appendChild(titleElement);
    notificationContainer.appendChild(messageElement);

    // Find the existing notifications on the page
    const existingNotifications = document.querySelectorAll('.custom-notification');

    // Calculate the total height of existing notifications
    let totalHeight = 0;
    existingNotifications.forEach((existingNotification) => {
        totalHeight += existingNotification.offsetHeight + 10; // 10 is the margin between notifications
    });

    // Set the top position for the new notification with margin
    notificationContainer.style.top = `${totalHeight + 16}px`; // Add margin to the total height

    // Add a class to identify the notification
    notificationContainer.classList.add('custom-notification');

    document.body.appendChild(notificationContainer);

    setTimeout(() => {
        document.body.removeChild(notificationContainer);
    }, 5000);
};

