const express = require('express');
const router = express.router();
const fileUpload = require('../utils/fileUpload')

const upload = fileUpload.single('image')

// router.post("/create", upload, async (req, res) => {
//     console.log(req.body);
//     console.log(req.file.filename);
//     let fileUrl = "../public/uploads/" + req.file.filename;
//     const response = await youtubeService.createBroadcast(
//         (title = req.body.title),
//         (description = req.body.description),
//         (scheduledStartTime = req.body.scheduledStartTime),
//         (scheduledEndTime = req.body.scheduledEndTime),
//         (boundStreamId = req.body.boundStreamId),
//         (privacyStatus = req.body.privacyStatus),
//         (selfDeclaredMadeForKids = req.body.selfDeclaredMadeForKids),
//         (enableAutoStart = req.body.enableAutoStart),
//         (enableAutoStop = req.body.enableAutoStop),
//         (enableEmbed = req.body.enableEmbed),
//         (recordFromStart = req.body.recordFromStart),
//         (fileUrl = fileUrl)
//     );
//     res.send(response);
// });

// router.post('/delete', async (req, res) => {

// })