const Quota = require('../models/Quota');

// @route   GET api/quota
// @desc    Get current quota limit
// @access  Private (Admin) and Public (for user home to display limit)
exports.getQuota = async (req, res) => {
    try {
        const quota = await Quota.findOne();
        if (!quota) {
            // Jika belum ada, bisa return default atau not found
            return res.status(200).json({ limit: 0, msg: 'Kuota belum diatur.' });
        }
        res.json(quota);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/quota
// @desc    Create quota limit (if not exists)
// @access  Private (Admin)
exports.createQuota = async (req, res) => {
    const { limit } = req.body;
    try {
        let quota = await Quota.findOne();
        if (quota) {
            return res.status(400).json({ msg: 'Kuota sudah ada, gunakan PUT untuk memperbarui.' });
        }

        quota = new Quota({ limit });
        await quota.save();
        res.status(201).json(quota);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/quota/:id (or just api/quota to update the single document)
// @desc    Update quota limit
// @access  Private (Admin)
exports.updateQuota = async (req, res) => {
    const { limit } = req.body; // Kita bisa update tanpa ID jika hanya ada 1 dokumen kuota
    try {
        let quota = await Quota.findOne(); // Hanya ada satu dokumen Quota
        if (!quota) {
            // Jika belum ada, buat baru
            quota = new Quota({ limit });
        } else {
            quota.limit = limit;
        }
        quota.lastUpdated = Date.now();
        await quota.save();
        res.json(quota);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};