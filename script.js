// CareerPath - CSE326 Internet Programming project

const careerData = {
  web: {
    title: "Web Development",
    roles: ["Frontend Developer", "Web Developer"],
    skills: ["HTML and semantic markup", "CSS and responsive design", "JavaScript and DOM manipulation", "Git and GitHub"]
  },
  data: {
    title: "Data Science",
    roles: ["Junior Data Analyst", "Data Science Intern"],
    skills: ["Python fundamentals", "SQL basics", "Spreadsheets and data cleaning", "Data visualisation"]
  },
  cyber: {
    title: "Cybersecurity",
    roles: ["Security Analyst (entry level)", "SOC Analyst Intern"],
    skills: ["Computer networks", "Linux fundamentals", "Security concepts", "Safe lab practice"]
  },
  app: {
    title: "App Development",
    roles: ["Junior App Developer", "Mobile App Intern"],
    skills: ["Programming fundamentals", "Kotlin or Java", "Mobile UI basics", "Working with APIs"]
  },
  design: {
    title: "UI/UX Design",
    roles: ["UI Designer", "UX Design Intern"],
    skills: ["Design principles", "Wireframing", "Figma basics", "User research"]
  }
};

const form = document.getElementById("careerForm");
const toast = document.getElementById("toast");
const checkboxes = [...document.querySelectorAll(".roadmap-task")];
let toastTimer;

// Read saved profile when the page opens.
function loadProfile() {
  const saved = localStorage.getItem("careerPathProfile");
  if (!saved) return;
  try {
    const profile = JSON.parse(saved);
    document.getElementById("studentName").value = profile.name || "";
    document.getElementById("interest").value = profile.interest || "";
    document.getElementById("skills").value = (profile.skills || []).join(", ");
    document.getElementById("level").value = profile.level || "beginner";
    updateDashboard(profile);
  } catch (error) {
    console.warn("Could not read the saved profile:", error);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function updateDashboard(profile) {
  const skills = profile.skills || [];
  const matches = profile.interest ? (careerData[profile.interest]?.roles.length || 0) : 0;
  document.getElementById("skillsCount").textContent = skills.length;
  document.getElementById("matchesCount").textContent = matches;
  document.getElementById("progressValue").textContent = `${Math.round((checkboxes.filter(box => box.checked).length / checkboxes.length) * 100)}%`;
}

function clearErrors() {
  ["nameError", "interestError", "skillsError"].forEach(id => {
    document.getElementById(id).textContent = "";
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const name = document.getElementById("studentName").value.trim();
  const interest = document.getElementById("interest").value;
  const rawSkills = document.getElementById("skills").value;
  const level = document.getElementById("level").value;
  const skills = rawSkills.split(",").map(skill => skill.trim()).filter(Boolean);

  let valid = true;
  if (name.length < 2) {
    document.getElementById("nameError").textContent = "Please enter a name with at least 2 characters.";
    valid = false;
  }
  if (!interest) {
    document.getElementById("interestError").textContent = "Please choose a career interest.";
    valid = false;
  }
  if (skills.length === 0) {
    document.getElementById("skillsError").textContent = "Add at least one skill, such as HTML or Python.";
    valid = false;
  }
  if (!valid) return;

  const profile = { name, interest, skills, level };
  localStorage.setItem("careerPathProfile", JSON.stringify(profile));
  updateDashboard(profile);
  showToast(`Your starter plan is ready, ${name.split(" ")[0]}!`);
  document.getElementById("roadmap").scrollIntoView({ behavior: "smooth" });
});

// Save roadmap progress in the browser.
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("careerPathTasks") || "[]");
  checkboxes.forEach((box, index) => {
    box.checked = Boolean(savedTasks[index]);
    box.closest(".roadmap-item").classList.toggle("completed", box.checked);
  });
  updateTaskProgress();
}

function updateTaskProgress() {
  const completed = checkboxes.filter(box => box.checked).length;
  document.getElementById("taskProgress").textContent = `${completed} of ${checkboxes.length} completed`;
  const saved = JSON.parse(localStorage.getItem("careerPathProfile") || "null");
  if (saved) updateDashboard(saved);
  else document.getElementById("progressValue").textContent = `${Math.round((completed / checkboxes.length) * 100)}%`;
}

checkboxes.forEach(box => {
  box.addEventListener("change", () => {
    box.closest(".roadmap-item").classList.toggle("completed", box.checked);
    localStorage.setItem("careerPathTasks", JSON.stringify(checkboxes.map(item => item.checked)));
    updateTaskProgress();
  });
});

// Search career cards using the input event.
const searchInput = document.getElementById("careerSearch");
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;
  document.querySelectorAll(".career-card").forEach(card => {
    const matches = card.dataset.search.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount++;
  });
  document.getElementById("noResults").hidden = visibleCount !== 0;
});

// Dialog content is filled from the selected career card.
const careerDetails = {
  "Web Developer": {
    description: "Web developers build and maintain websites and web applications. They work on layout, interaction and performance.",
    skills: ["HTML and semantic HTML", "CSS and responsive layouts", "JavaScript", "Git and debugging"]
  },
  "Data Analyst": {
    description: "Data analysts organise information, look for patterns and communicate findings that help teams make decisions.",
    skills: ["Excel or spreadsheets", "SQL", "Python basics", "Charts and data storytelling"]
  },
  "Cybersecurity Analyst": {
    description: "Cybersecurity analysts help teams understand and reduce risks to computers, networks and information.",
    skills: ["Networking fundamentals", "Linux basics", "Security awareness", "Log analysis"]
  },
  "App Developer": {
    description: "App developers create applications for phones and tablets, from the user interface to the features behind it.",
    skills: ["Java or Kotlin", "Mobile interface design", "APIs", "Testing and debugging"]
  }
};

const dialog = document.getElementById("careerDialog");
document.querySelectorAll(".card-link").forEach(button => {
  button.addEventListener("click", () => {
    const title = button.dataset.career;
    const details = careerDetails[title];
    document.getElementById("dialogTitle").textContent = title;
    document.getElementById("dialogDescription").textContent = details.description;
    const list = document.getElementById("dialogSkills");
    list.replaceChildren();
    details.skills.forEach(skill => {
      const item = document.createElement("li");
      item.textContent = skill;
      list.appendChild(item);
    });
    dialog.showModal();
  });
});

document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

// Mobile navigation.
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Browser API example: share the project if Web Share API is available.
if (navigator.share) {
  document.querySelector(".footer-inner .brand").addEventListener("contextmenu", async event => {
    event.preventDefault();
    try {
      await navigator.share({ title: "CareerPath", text: "Explore my CareerPath student project.", url: location.href });
    } catch (error) {
      console.info("Share was cancelled or unavailable.", error);
    }
  });
}

loadTasks();
loadProfile();
