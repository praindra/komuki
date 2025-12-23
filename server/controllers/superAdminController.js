const User = require('../models/User');

// GET /api/superadmin/users?role=admin|operator
exports.listUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role) query.role = role;
    // exclude superadmins from being listed unless explicitly requested
    if (!role) query.role = { $in: ['admin', 'operator'] };

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// POST /api/superadmin/users
// body: { username, password, role }
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) return res.status(400).json({ msg: 'Missing fields.' });
    if (!['admin', 'operator', 'superadmin'].includes(role)) return res.status(400).json({ msg: 'Invalid role.' });

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ msg: 'Username sudah ada.' });

    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ msg: 'User created.', user: { _id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// PUT /api/superadmin/users/:id
// body: { username?, password? }
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found.' });

    if (username) user.username = username;
    if (password) user.password = password; // will be hashed in pre-save

    await user.save();
    res.json({ msg: 'User updated.', user: { _id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// DELETE /api/superadmin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found.' });
    if (user.role === 'superadmin') return res.status(403).json({ msg: 'Cannot delete superadmin via this endpoint.' });

    await User.findByIdAndDelete(id);
    res.json({ msg: 'User deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};
