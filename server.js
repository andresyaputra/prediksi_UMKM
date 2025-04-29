const express = require('express');
const path = require('path');
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(cors());



// Middleware Autentikasi & Autorisasi Admin
function authenticateToken(req, res, next) {
    const token = req.header('Authorization') || req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Akses ditolak, token tidak ditemukan" });
    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
        if (err) return res.status(403).json({ error: "Token tidak valid" });
        req.user = user;
        next();
    });
}

function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Akses ditolak! Hanya admin yang bisa mengakses endpoint ini." });
    }
    next();
}

// Koneksi ke database MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "umkm_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// Middleware untuk melayani file statis dari folder frontend
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin', 'admin-dashboard.html'));
});

app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin-login.html'));
    res.sendFile(path.join(__dirname, 'frontend', 'admin', 'admin-login.html'));
});


app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});
app.get('/layanan', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'layanan.html'));
});

app.get('/hubungikai', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'hubungikami.html'));
});



// API untuk menyimpan hasil prediksi ke MySQL
app.post("/save-prediction", (req, res) => {
    const { Owner_Name, Business_Name, Business_Location, Age, Education, Initial_Capital, 
            Financial_Record_Keeping, Internet_Usage, Business_Plan, Marketing_Effort, 
            Partnership, Parent_Business_Experience, Industry_Experience, Owner_Gender, 
            Professional_Advice, prediction, probability } = req.body;

    const sql = `INSERT INTO predictions 
                (owner_name, business_name, business_location, age, education, initial_capital, 
                financial_record_keeping, internet_usage, business_plan, marketing_effort, 
                partnership, parent_business_experience, industry_experience, owner_gender, 
                professional_advice, prediction, probability) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [Owner_Name, Business_Name, Business_Location, Age, Education, Initial_Capital, 
                    Financial_Record_Keeping, Internet_Usage, Business_Plan, Marketing_Effort, 
                    Partnership, Parent_Business_Experience, Industry_Experience, Owner_Gender, 
                    Professional_Advice, prediction, probability];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Gagal menyimpan ke database:", err);
            return res.status(500).json({ error: "Gagal menyimpan data" });
        }
        res.json({ message: "Data berhasil disimpan ke database" });
    });
});

// ================================
// Endpoint Admin
// ================================

// Endpoint: Login Admin
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if(err) return res.status(500).json({ error: err.message });
        if(results.length === 0) return res.status(401).json({ error: "User tidak ditemukan" });
        const user = results[0];
        // Pastikan hanya admin yang dapat login
        if(user.role !== 'admin'){
            return res.status(403).json({ error: "Akses ditolak! Hanya admin yang bisa login." });
        }
        // Validasi password (contoh perbandingan langsung; gunakan bcrypt di produksi)
        if(password !== user.password){
            return res.status(401).json({ error: "Password salah" });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        res.json({ token });
    });
});

// Endpoint: Ambil data UMKM dengan optional filter search
app.get('/admin/data', authenticateToken, authorizeAdmin, (req, res) => {
    let { owner, business, location } = req.query;
    let sql = "SELECT * FROM predictions WHERE 1=1";
    let params = [];
    if(owner) {
        sql += " AND owner_name LIKE ?";
        params.push(`%${owner}%`);
    }
    if(business) {
        sql += " AND business_name LIKE ?";
        params.push(`%${business}%`);
    }
    if(location) {
        sql += " AND business_location LIKE ?";
        params.push(`%${location}%`);
    }
    db.query(sql, params, (err, results) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Endpoint: Hapus data UMKM
app.delete('/admin/delete/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const sql = "DELETE FROM predictions WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json({ message: "Data berhasil dihapus" });
    });
});

// Endpoint: Import data Excel
app.post('/admin/import', authenticateToken, authorizeAdmin, (req, res) => {
    const { data } = req.body;
    // Contoh: insert data secara massal. Pastikan data sesuai dengan format tabel.
    let sql = `INSERT INTO predictions 
            (owner_name, business_name, business_location, age, education, initial_capital, 
                financial_record_keeping, internet_usage, business_plan, marketing_effort, 
                partnership, parent_business_experience, industry_experience, owner_gender, 
                professional_advice, prediction, probability) 
            VALUES ?`;
    const values = data.map(item => [
        item.owner_name || item.Owner_Name,
        item.business_name || item.Business_Name,
        item.business_location || item.Business_Location,
        item.age || item.Age,
        item.education || item.Education,
        item.initial_capital || item.Initial_Capital,
        item.financial_record_keeping || item.Financial_Record_Keeping,
        item.internet_usage || item.Internet_Usage,
        item.business_plan || item.Business_Plan,
        item.marketing_effort || item.Marketing_Effort,
        item.partnership || item.Partnership,
        item.parent_business_experience || item.Parent_Business_Experience,
        item.industry_experience || item.Industry_Experience,
        item.owner_gender || item.Owner_Gender,
        item.professional_advice || item.Professional_Advice,
        item.prediction || '',
        item.probability || 0
    ]);
    db.query(sql, [values], (err, result) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json({ message: "Data import berhasil" });
    });
});

// ================================
// Akhir Endpoint Admin
// ================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});


// Konfigurasi multer untuk menyimpan video
const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// API untuk mendapatkan semua video
app.get('/api/videos', (req, res) => {
    db.query('SELECT * FROM videos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// API untuk menambahkan video
app.post('/api/videos', upload.single("video"), (req, res) => {
    const { title, description } = req.body;
    const video_url = req.file ? `/uploads/${req.file.filename}` : null;

    db.query(
        'INSERT INTO videos (title, description, video_url) VALUES (?, ?, ?)',
        [title, description, video_url],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Video berhasil ditambahkan' });
        }
    );
});

// API untuk menghapus video
app.delete('/api/videos/:id', (req, res) => {
    const { id } = req.params;
    db.query(
        'DELETE FROM videos WHERE id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Video berhasil dihapus' });
        }
    );
});

// ✅ API: Mengedit video
app.put('/api/videos/:id', upload.single('video'), (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;
    const video_url = req.file ? `/uploads/${req.file.filename}` : null;

    let sql = 'UPDATE videos SET title = ?, description = ?';
    let values = [title, description];

    if (video_url) {
        sql += ', video_url = ?';
        values.push(video_url);
    }

    sql += ' WHERE id = ?';
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Video berhasil diperbarui!' });
    });
});