// Load saved data
window.onload = function() {
  let saved = localStorage.getItem("resumeData");

  if(saved){
    let data = JSON.parse(saved);

    document.getElementById("name").value = data.name || "";
    document.getElementById("title").value = data.title || "";
    document.getElementById("skills").value = data.skills || "";
    document.getElementById("education").value = data.education || "";
    document.getElementById("experience").value = data.experience || "";

    updatePreview(data);

    if(data.photo){
      document.getElementById("r-photo").src = data.photo;
    }
  }
}

// Update preview
function updatePreview(data){
  document.getElementById("r-name").innerText = data.name || "Your Name";
  document.getElementById("r-title").innerText = data.title || "Your Title";

  // Skills tags
  let skillsHTML = "";
  if(data.skills){
    data.skills.split(",").forEach(skill => {
      skillsHTML += `<span>${skill.trim()}</span>`;
    });
  }
  document.getElementById("r-skills").innerHTML = skillsHTML;

  document.getElementById("r-education").innerText = data.education || "";
  document.getElementById("r-experience").innerText = data.experience || "";
}

// Generate
function generateResume() {
  let photoSrc = document.getElementById("r-photo").src;

  let data = {
    name: document.getElementById("name").value,
    title: document.getElementById("title").value,
    skills: document.getElementById("skills").value,
    education: document.getElementById("education").value,
    experience: document.getElementById("experience").value,
    photo: photoSrc
  };

  localStorage.setItem("resumeData", JSON.stringify(data));

  updatePreview(data);
}

// Photo upload
document.getElementById("photo").addEventListener("change", function() {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    document.getElementById("r-photo").src = reader.result;
  }

  if(file){
    reader.readAsDataURL(file);
  }
});

// AI Suggest
function aiSuggest() {
  document.getElementById("skills").value =
    "Communication, Leadership, Problem Solving, Teamwork";

  document.getElementById("experience").value =
    "Worked on projects showing leadership and innovation.";

  generateResume();
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Template change
function changeTemplate(template) {
  let resume = document.getElementById("resume");

  resume.classList.remove("template1", "template2");
  resume.classList.add(template);
}

// PDF Download
function downloadPDF() {
  const element = document.getElementById("resume");

  html2pdf().set({
    margin: 0.5,
    filename: 'Resume-Pro.pdf',
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4' }
  }).from(element).save();
}
