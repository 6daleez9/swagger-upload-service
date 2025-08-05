const express = require('express');
const multer = require('multer');
const { protect } = require ('../middleware/authMiddleware.js');
const { adminOnly } = require ('../middleware/roleMiddleware.js');
const { uploadSwaggerHandler } = require ('../controllers/adminController.js');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-swagger', protect, adminOnly, upload.single('swaggerFile'), uploadSwaggerHandler);

module.exports = router;