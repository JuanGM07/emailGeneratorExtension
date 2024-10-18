document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const resultArea = document.getElementById('result');
    const spinner = document.getElementById('spinner');
    const dailyLimit = 3; // Límite de 5 emails al día

    // Evento para el botón de donaciones
    document.getElementById('donateBtn').addEventListener('click', function () {
        const paypalMeUrl = 'https://paypal.me/JGMDataScience?country.x=ES&locale.x=es_ES'; // Enlace PayPal
        window.open(paypalMeUrl, '_blank');
    });

    // Obtener la API_KEY de chrome.storage.local
    chrome.storage.local.get('API_KEY', function (data) {
        const apiKey = data.API_KEY; // Recuperar la API key del almacenamiento

        // Función para contar el número de emails generados en un día
        function checkDailyUsage(callback) {
            chrome.storage.local.get(['usage'], function (result) {
                const today = new Date().toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD
                let usage = result.usage || { date: today, count: 0 }; // Inicializar si no existe

                // Si ha cambiado el día, reiniciar el contador
                if (usage.date !== today) {
                    usage = { date: today, count: 0 };
                    chrome.storage.local.set({ usage });
                }

                callback(usage);
            });
        }
        // Evento de clic en el botón de generación de email
        generateBtn.addEventListener('click', async function () {
            checkDailyUsage(function (usage) {
                if (usage.count < dailyLimit) {
                    const topic = document.getElementById('topic').value;
                    const details = document.getElementById('details').value;
                    const tone = document.getElementById('tone').value;

                    if (topic && details && tone) {
                        spinner.style.display = 'block';
                        resultArea.value = ''; // Limpiar el área de resultado

                        fetch('https://api.openai.com/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`
                            },
                            body: JSON.stringify({
                                model: "gpt-3.5-turbo",
                                messages: [
                                    { role: "system", content: `Write an email with the following topic: ${topic}. Here are the details: ${details}. The tone should be ${tone}.` }
                                ],
                                max_tokens: 150
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            const generatedEmail = data.choices[0].message.content.trim();
                            resultArea.value = generatedEmail;

                            // Incrementar el contador de emails generados
                            usage.count += 1;
                            chrome.storage.local.set({ usage });
                        })
                        .catch(error => {
                            resultArea.value = 'Error generating email.';
                            console.error('Error generating email:', error);
                        })
                        .finally(() => {
                            spinner.style.display = 'none'; // Ocultar el spinner
                        });
                    } else {
                        alert("Please fill in all the fields.");
                    }
                } else {
                    // Mostrar mensaje de límite alcanzado
                    alert('Oops, you can only generate 3 emails per day.');
                }
            });
        });

        // Evento de clic en el botón de copiar
        copyBtn.addEventListener('click', function () {
            resultArea.select();
            document.execCommand('copy');
            alert('Email copied to clipboard');
        });
    });
});
