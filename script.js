const translations = {
    "en": {
        "greeting": "Hello",
        "farewell": "Goodbye"
    },
    "es": {
        "greeting": "Hola",
        "farewell": "Adiós"
    },
    "fr": {
        "greeting": "Bonjour",
        "farewell": "Au revoir"
    },
    "de": {
        "greeting": "Hallo",
        "farewell": "Auf Wiedersehen"
    },
    "zh": {
        "greeting": "你好",
        "farewell": "再见"
    },
    "ja": {
        "greeting": "こんにちは",
        "farewell": "さようなら"
    }
};

function switchLanguage(language) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[language][key] || element.textContent;
    });
}

// Usage example:
// switchLanguage('es');  // to switch to Spanish
