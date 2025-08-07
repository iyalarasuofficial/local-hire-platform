import express from 'express';
import User from '../models/User.js';
import Worker from '../models/Worker.js'

const router = express.Router();

router.get('/check/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    if (user) {
      return res.json({ exists: true, role: 'user' });
    }

    const worker = await Worker.findOne({ uid });
    if (worker) {
      return res.json({ exists: true, role: 'worker' });
    }
    const admin = await Admin.findOne({ uid });
    if (Admin) {
      return res.json({ exists: true, role: 'admin' });
    }

    res.json({ exists: false, role: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
