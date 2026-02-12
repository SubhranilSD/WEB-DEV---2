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
    const Card = document.createElement("div");
    //adding class name dynamically
    Card.className = "event-card";
    Card.innerHTML = `
        <h3>${eventData.title}</h3>
        <p><strong>Date:</strong> ${eventData.date}</p>
        <p><strong>Category:</strong> ${eventData.category}</p>
        <p><strong>Description:</strong> ${eventData.description}</p>
    `;
    return Card;
}



//Add event append
function addEvent(eventData) {
    const emptyState = document.querySelector(".empty-state");
    if (emptyState) {
        emptyState.remove();
    }
    const eventCard = createEventCard(eventData);
    eventContainer.appendChild(eventCard);
}



//add event
eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const eventData = {
        title: eventTitle.value,
        date: eventDate.value,
        category: eventCategory.value,
        description: eventDescription.value
    };
    addEvent(eventData);
})


eventContainer.addEventListener("click", (event) => {
    const Card = event.target.closest(".event-card");
    console.log(Card);
    if (event.target.classList.contains("delete-btn")) {
        Card.remove();
    }
    if (!eventContainer.querySelector(".event-card")) {
        eventContainer.innerHTML = "<div class='empty-state'>No events yet. Add your first event!</div>";
    }
})

addSampleBtn.addEventListener("click", () => {
    sampleEvent.forEach((addEvent))
})


clearAllBtn.addEventListener("click", () => {
    eventContainer.innerHTML = "<div class='empty-state'>No events yet. Add your first event!</div>";

})


