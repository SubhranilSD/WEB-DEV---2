const eventForm = document.getElementById("eventForm");
const eventTitle = document.getElementById("eventTitle");
const eventDate = document.getElementById("eventDate");
const eventCategory = document.getElementById("eventCategory");
const eventDescription = document.getElementById("eventDescription");
const clearAllBtn = document.getElementById("clearAllBtn");
const addSampleBtn = document.getElementById("addSampleBtn");
const eventContainer = document.getElementById("eventContainer");

//take 2 sample events for Add sample event data
let sampleEvent = [
    {
        title: "web dev",
        date: "4-6-2026",
        category: "workshop",
        description: "ahgs h adg ihai dgjabds"
    },
    {
        title: "web dev2",
        date: "4-7-2026",
        category: "conference",
        description: "..." // Code continues below visible area
    }
];
//Create event card which contains the user data and we store it inside a div
function createEventCard(eventData) {
    const eventCard = document.createElement("div");
    eventCard.classList.add("event-card");
    eventCard.innerHTML = `
        <h3>${eventData.title}</h3>
        <p><strong>Date:</strong> ${eventData.date}</p>
        <p><strong>Category:</strong> ${eventData.category}</p>
        <p><strong>Description:</strong> ${eventData.description}</p>
    `;
    return eventCard;
}
//Add event
eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const eventData = {
        title: eventTitle.value,
        date: eventDate.value,
        category: eventCategory.value,
        description: eventDescription.value
    };
    addEvent(eventData);
});
