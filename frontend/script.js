const form = document.getElementById('predictionForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        // Kirim data ke Flask untuk prediksi
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.error) {
            resultDiv.innerText = `Error: ${result.error}`;
        } else {
            resultDiv.innerHTML = `
                <p>Prediction: ${result.prediction}</p>
                <p>Probability of Success: ${(result.probability * 100).toFixed(2)}%</p>
            `;

            // Tambahkan hasil prediksi ke data sebelum disimpan ke MySQL
            data.prediction = result.prediction;
            data.probability = result.probability;

            // Simpan ke MySQL melalui backend Node.js
            await fetch('http://127.0.0.1:3000/save-prediction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            alert("Data berhasil disimpan ke database!");
        }
    } catch (error) {
        resultDiv.innerText = `Error: ${error}`;
    }
});
