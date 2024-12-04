async function saveExperience() {
    const description = document.getElementById("description").value || null;
    const hobbies = [...document.querySelectorAll("#hobbies .hobby-entry input")]
        .map((hobby) => hobby.value.trim())
        .filter((hobby) => hobby)
        .join(", ");

    const workExperienceList = [...document.querySelectorAll("#workExperienceList .work-entry")];
    const workExperience = workExperienceList.map((entry) => ({
        jobTitle: entry.querySelector("input[placeholder='Job Title']").value.trim() || "N/A",
        city: entry.querySelector("input[placeholder='City/Town']").value.trim() || "N/A",
        employer: entry.querySelector("input[placeholder='Employer']").value.trim() || "N/A",
        startDate: `${entry.querySelector("select").value} ${entry.querySelector(".dateYear").value}`,
        endDate: `${entry.querySelectorAll("select")[1].value} ${entry.querySelectorAll(".dateYear")[1].value}`,
        description: entry.querySelector("textarea").value.trim() || "N/A"
    }));

    const educationList = [...document.querySelectorAll("#educationList .education-entry")];
    const education = educationList.map((entry) => ({
        degree: entry.querySelector("input[placeholder='Degree']").value.trim() || "N/A",
        city: entry.querySelector("input[placeholder='City/Town']").value.trim() || "N/A",
        institution: entry.querySelector("input[placeholder='Institution']").value.trim() || "N/A",
        startDate: `${entry.querySelector("select").value} ${entry.querySelector(".dateYear").value}`,
        endDate: `${entry.querySelectorAll("select")[1].value} ${entry.querySelectorAll(".dateYear")[1].value}`,
        description: entry.querySelector("textarea").value.trim() || "N/A"
    }));

    const skillsList = [...document.querySelectorAll("#skillsList .skill-entry")];
    const skills = skillsList.map((entry) => ({
        skill: entry.querySelector("input[placeholder='Skill']").value.trim() || "N/A",
        level: entry.querySelector("select").value.trim()
    }));

    try {
        const response = await fetch("http://localhost:3000/experience", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description, hobbies, workExperience, education, skills })
        });

        if (response.ok) {
            alert("Experience data saved successfully!");
            window.location.href = "CV.html";
        } else {
            alert("Failed to save experience data. Please try again.");
        }
    } catch (error) {
        console.error("Error saving experience data:", error);
        alert("An unexpected error occurred. Please try again.");
    }
}

function addWorkExperience() {
    const workExperienceList = document.getElementById("workExperienceList");

    const workEntry = document.createElement("div");
    workEntry.classList.add("work-entry");

    workEntry.innerHTML = `
        <input type="text" placeholder="Job Title">
        <input type="text" placeholder="City/Town">
        <input type="text" placeholder="Employer">
        <label>Start Date</label>
        <select>${generateMonthOptions()}</select>
        <input type="number" class="dateYear" placeholder="Year">
        <label>End Date</label>
        <select>${generateMonthOptions()}</select>
        <input type="number" class="dateYear" placeholder="Year">
        <textarea placeholder="Description"></textarea>
        <button onclick="deleteEntry(this)">Delete</button>
    `;

    workExperienceList.appendChild(workEntry);
}

function addEducation() {
    const educationList = document.getElementById("educationList");

    const educationEntry = document.createElement("div");
    educationEntry.classList.add("education-entry");

    educationEntry.innerHTML = `
        <input type="text" placeholder="Degree">
        <input type="text" placeholder="City/Town">
        <input type="text" placeholder="Institution">
        <label>Start Date</label>
        <select>${generateMonthOptions()}</select>
        <input type="number" class="dateYear" placeholder="Year">
        <label>End Date</label>
        <select>${generateMonthOptions()}</select>
        <input type="number" class="dateYear" placeholder="Year">
        <textarea placeholder="Description"></textarea>
        <button onclick="deleteEntry(this)">Delete</button>
    `;

    educationList.appendChild(educationEntry);
}

function addSkill() {
    const skillsList = document.getElementById("skillsList");

    const skillEntry = document.createElement("div");
    skillEntry.classList.add("skill-entry");

    skillEntry.innerHTML = `
        <input type="text" placeholder="Skill">
        <select>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Expert</option>
        </select>
        <button onclick="deleteEntry(this)">Delete</button>
    `;

    skillsList.appendChild(skillEntry);
}

function addHobby() {
    const hobbiesSection = document.getElementById("hobbies");

    const hobbyEntry = document.createElement("div");
    hobbyEntry.classList.add("hobby-entry");

    hobbyEntry.innerHTML = `
        <input type="text" placeholder="Hobby">
        <button onclick="deleteEntry(this)">Delete</button>
    `;

    hobbiesSection.appendChild(hobbyEntry);
}

function deleteEntry(button) {
    button.parentElement.remove();
}

function generateMonthOptions() {
    return `
        <option value="" disabled selected>Select Month</option>
        <option>January</option>
        <option>February</option>
        <option>March</option>
        <option>April</option>
        <option>May</option>
        <option>June</option>
        <option>July</option>
        <option>August</option>
        <option>September</option>
        <option>October</option>
        <option>November</option>
        <option>December</option>
    `;
}
