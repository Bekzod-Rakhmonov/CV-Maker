async function loadCVData() {
    try {
        const personalDetailsResponse = await fetch("http://localhost:3000/personal-details");
        const personalDetails = await personalDetailsResponse.json();

        if (personalDetails) {
            document.getElementById("fullName").textContent = personalDetails.full_name || "Full Name";
            document.getElementById("phoneNumber").textContent = personalDetails.phone_number || "";
            document.getElementById("email").textContent = personalDetails.email || "";
            document.getElementById("dob").textContent = personalDetails.date_of_birth || "";
            document.getElementById("gender").textContent = personalDetails.gender || "";
            const linkedin = document.getElementById("linkedinLink");
            if (personalDetails.linkedin) {
                linkedin.href = personalDetails.linkedin;
                linkedin.textContent = "LinkedIn";
                linkedin.classList.remove("hidden");
            } else {
                linkedin.classList.add("hidden");
            }

            const website = document.getElementById("websiteLink");
            if (personalDetails.website) {
                website.href = personalDetails.website;
                website.textContent = "Website";
                website.classList.remove("hidden");
            } else {
                website.classList.add("hidden");
            }

            const photoElement = document.getElementById("photoDisplay");
            if (personalDetails.photo) {
                photoElement.src = personalDetails.photo; // Set Base64 string as src
                photoElement.alt = "Profile Photo";
                photoElement.classList.remove("hidden");
            } else {
                photoElement.src = ""; // Clear src
                photoElement.alt = ""; // Remove alt text
                photoElement.classList.add("hidden");
            }

        }

        const experienceResponse = await fetch("http://localhost:3000/experience");
        const experienceData = await experienceResponse.json();

        if (experienceData) {
            if (experienceData.description) {
                document.getElementById("resumeObjective").textContent = experienceData.description;
            } else {
                document.querySelector(".objective.section").classList.add("hidden");
            }

            if (experienceData.work_experience) {
                const workExperience = JSON.parse(experienceData.work_experience);
                if (workExperience.length > 0) {
                    const workExperienceContainer = document.getElementById("workExperience");
                    workExperience.forEach((work) => {
                        const workEntry = document.createElement("div");
                        workEntry.innerHTML = `
                            <h3>${work.jobTitle || ""}</h3>
                            <p>${work.employer || ""}, ${work.city || ""}</p>
                            <p>${work.startDate || ""} - ${work.endDate || ""}</p>
                            <p>${work.description || ""}</p>
                        `;
                        workExperienceContainer.appendChild(workEntry);
                    });
                    document.getElementById("work-experience-section").classList.remove("hidden");
                } else {
                    document.getElementById("work-experience-section").classList.add("hidden");
                }
            } else {
                document.getElementById("work-experience-section").classList.add("hidden");
            }

            if (experienceData.education) {
                const education = JSON.parse(experienceData.education);
                if (education.length > 0) {
                    const educationContainer = document.getElementById("education");
                    education.forEach((edu) => {
                        const educationEntry = document.createElement("div");
                        educationEntry.innerHTML = `
                            <h3>${edu.degree || ""}</h3>
                            <p>${edu.institution || ""}, ${edu.city || ""}</p>
                            <p>${edu.startDate || ""} - ${edu.endDate || ""}</p>
                            <p>${edu.description || ""}</p>
                        `;
                        educationContainer.appendChild(educationEntry);
                    });
                    document.getElementById("education-section").classList.remove("hidden");
                } else {
                    document.getElementById("education-section").classList.add("hidden");
                }
            } else {
                document.getElementById("education-section").classList.add("hidden");
            }

            if (experienceData.skills) {
                const skills = JSON.parse(experienceData.skills);
                if (skills.length > 0) {
                    const skillsList = document.getElementById("skillsList");
                    skills.forEach((skill) => {
                        const skillItem = document.createElement("li");
                        skillItem.textContent = `${skill.skill || ""} - ${skill.level || ""}`;
                        skillsList.appendChild(skillItem);
                    });
                    document.getElementById("skills-section").classList.remove("hidden");
                } else {
                    document.getElementById("skills-section").classList.add("hidden");
                }
            } else {
                document.getElementById("skills-section").classList.add("hidden");
            }

            if (experienceData.hobbies) {
                const hobbies = experienceData.hobbies.split(", ");
                if (hobbies.length > 0) {
                    const hobbiesList = document.getElementById("interestsList");
                    hobbies.forEach((hobby) => {
                        const hobbyItem = document.createElement("li");
                        hobbyItem.textContent = hobby;
                        hobbiesList.appendChild(hobbyItem);
                    });
                    document.getElementById("interests-section").classList.remove("hidden");
                } else {
                    document.getElementById("interests-section").classList.add("hidden");
                }
            } else {
                document.getElementById("interests-section").classList.add("hidden");
            }
        }
    } catch (error) {
        console.error("Error loading CV data:", error);
    }
}

document.getElementById("downloadPDF").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    const cvElement = document.getElementById("cv");

    html2canvas(cvElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = 190;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save("CV.pdf");
    });
});


window.onload = loadCVData;
