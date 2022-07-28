
const getGreeting = () => {
    const date = new Date();
    const greeting = {
        morning: ' Good morning',
        afternoon: ' Good afternoon',
        evening: 'Good evening',
        night: 'Good night'
    };
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) {
        return greeting.morning;
    }
    if (hour >= 12 && hour < 16) {
        return greeting.afternoon;
    }
    if (hour >= 16 && hour < 20) {
        return greeting.evening;
    }
    return greeting.night;
}

module.exports = getGreeting;