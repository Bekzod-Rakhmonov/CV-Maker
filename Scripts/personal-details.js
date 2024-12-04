document.getElementById("nextButton").addEventListener("click", async function () {
    const form = document.getElementById("personalDetailsForm");
    const mandatoryFields = form.querySelectorAll("[required]");
    let isValid = true;

    mandatoryFields.forEach((field) => {
        field.style.borderColor = "#ccc";
        if (!field.value.trim()) {
            field.style.borderColor = "red";
            isValid = false;
        }
    });

    if (isValid) {
        const fileInput = document.getElementById("photo");
        let photoBase64 = null;

        if (fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                photoBase64 = e.target.result; // Base64 string
                submitForm(photoBase64);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            submitForm(photoBase64); // Submit without photo if not provided
        }
    } else {
        alert("Please fill out all mandatory fields.");
    }
});

async function submitForm(photoBase64) {
    const formData = {
        full_name: `${document.getElementById("firstName").value.trim()} ${document.getElementById("lastName").value.trim()}`,
        email: document.getElementById("email").value.trim(),
        phone_number: document.getElementById("phone").value.trim(),
        gender: document.getElementById("gender").value,
        date_of_birth: document.getElementById("dob").value,
        linkedin: document.getElementById("linkedin").value.trim(),
        website: document.getElementById("website").value.trim(),
        photo: photoBase64, // Base64 image string
    };

    try {
        const response = await fetch("http://localhost:3000/personal-details", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Personal details saved successfully!");
            window.location.href = "experience.html";
        } else {
            alert("Failed to save personal details. Please try again.");
        }
    } catch (error) {
        console.error("Error saving personal details:", error);
        alert("An error occurred. Please try again.");
    }
}
