function login(email, pass, cb) {
    setTimeout(() => {
        cb({ userId: email, isLoggedIn: true, message: "Login successful" });
    }, 3000);
}


function getvideoList(user, cb) {
    setTimeout(() => {
        cb(["video1", "video2", "video3"]);
    }, 4000);
}

function getvideoDetails(video, cb) {
    setTimeout(() => {
        cb({ title: video, duration: "2 min", genre: "Action" });
    }, 1000);
}

login("user@example.com", "password", (userDetails) => {
    console.log("User details:", userDetails);

    getvideoList(userDetails.userId, (videoList) => {
        console.log("Video list:", videoList);

        getvideoDetails(videoList[0], (videoDetails) => {
            console.log("Video details:", videoDetails);
        });
    });
});