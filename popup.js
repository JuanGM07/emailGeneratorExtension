document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const resultArea = document.getElementById('result');
    const spinner = document.getElementById('spinner');

    generateBtn.addEventListener('click', async function () {
        const topic = document.getElementById('topic').value;
        const details = document.getElementById('details').value;
        const tone = document.getElementById('tone').value;

        if (topic && details && tone) {
            spinner.style.display = 'block';
            resultArea.value = '';

            try {
                const response = await fetch("https://email-generator-chi.vercel.app/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ topic, details, tone })
                });

                const data = await response.json();
                const generatedEmail = data.choices[0].message.content.trim();
                resultArea.value = generatedEmail;
            } catch (error) {
                resultArea.value = 'Error generating email.';
                console.error(error);
            } finally {
                spinner.style.display = 'none';
            }
        } else {
            alert("Please fill in all the fields.");
        }
    });

    copyBtn.addEventListener('click', function () {
        resultArea.select();
        document.execCommand('copy');
        alert('Email copied to clipboard');
    });
});

  