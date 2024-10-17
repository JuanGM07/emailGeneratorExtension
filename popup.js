document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const resultArea = document.getElementById('result');
    const spinner = document.getElementById('spinner');

    chrome.storage.local.get('API_KEY', function(data) {
        const apiKey = data.API_KEY; // Retrieve the API key from storage

        generateBtn.addEventListener('click', async function() {
            const topic = document.getElementById('topic').value;
            const details = document.getElementById('details').value;
            const tone = document.getElementById('tone').value;

            if (topic && details && tone) {
                spinner.style.display = 'block';
                resultArea.value = ''; 

                try {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
                    });

                    const data = await response.json();
                    const generatedEmail = data.choices[0].message.content.trim();
                    resultArea.value = generatedEmail;

                } catch (error) {
                    resultArea.value = 'Error generating email.';
                    console.error('Error generating email:', error);
                } finally {
                    spinner.style.display = 'none';
                }
            } else {
                alert("Please fill in all the fields.");
            }
        });

        copyBtn.addEventListener('click', function() {
            resultArea.select();
            document.execCommand('copy');
            alert('Email copied to clipboard');
        });
    });
});
