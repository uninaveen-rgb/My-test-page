// script.js

// Define multilingual support 
const translations = {
    "en": {
        "research": "Research", 
        "services": "Services", 
        "team": "Team", 
        "contact": "Contact"
    },
    "es": {
        "research": "Investigación", 
        "services": "Servicios", 
        "team": "Equipo", 
        "contact": "Contacto"
    },
    "fr": {
        "research": "Recherche", 
        "services": "Services", 
        "team": "Équipe", 
        "contact": "Contact"
    },
    "de": {
        "research": "Forschung", 
        "services": "Dienstleistungen", 
        "team": "Team", 
        "contact": "Kontakt"
    },
    "zh": {
        "research": "研究", 
        "services": "服务", 
        "team": "团队", 
        "contact": "联系"
    },
    "ja": {
        "research": "研究", 
        "services": "サービス", 
        "team": "チーム", 
        "contact": "連絡"
    }  
};

// Function to change language and update the DOM
function changeLanguage(lang) {
    document.getElementById('research').innerText = translations[lang].research;
    document.getElementById('services').innerText = translations[lang].services;
    document.getElementById('team').innerText = translations[lang].team;
    document.getElementById('contact').innerText = translations[lang].contact;
}

// Animation example for language switcher
const languageSwitcher = document.getElementById('language-switcher');
languageSwitcher.addEventListener('click', () => {
    languageSwitcher.classList.add('animated');
    setTimeout(() => languageSwitcher.classList.remove('animated'), 1000);
});

// Initial language setting
changeLanguage('en'); 

// Add event listeners for language options
const languageOptions = document.querySelectorAll('.language-option');
languageOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        changeLanguage(e.target.dataset.lang);
    });
});