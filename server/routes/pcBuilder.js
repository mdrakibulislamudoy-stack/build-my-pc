const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCompatibleComponents,
  checkCompatibility,
  savePCBuild,
  getSavedBuilds,
  getSavedBuildById,
  updateSavedBuild,
  deleteSavedBuild,
  getPublicBuilds
} = require('../controllers/pcBuilderController');

router.get('/compatible', getCompatibleComponents);
router.post('/check', checkCompatibility);
router.get('/public', getPublicBuilds);
router.get('/saved', protect, getSavedBuilds);
router.get('/saved/:id', protect, getSavedBuildById);
router.post('/save', protect, savePCBuild);
router.put('/saved/:id', protect, updateSavedBuild);
router.delete('/saved/:id', protect, deleteSavedBuild);

module.exports = router;
