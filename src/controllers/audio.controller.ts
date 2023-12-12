import Audio from "@/models/audio.model";
import { deleteS3File, s3client } from "@/utils/s3service";
import { AWS_BUCKET_NAME, AWS_REGION, BASE_URL } from "@/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import Album from "@/models/album.model";
import cron from 'node-cron';

/**
 * Interface for specifying optional fields for updating audio details.
 */
interface UpdateFields {
  Musictitle?: string;
  artist?: string;
  description?: string;
  lyrics?: string;
}

/**
 * @route GET /api/users
 * @description Get all users
 * @access Public
 */
 export const uploadMusicFiles = async (req, res) => {
  // Extract relevant data from the request body
  const { Musictitle, artist, lyrics, AlbumName} = req.body;

  if (!Musictitle) {
    return res.status(400).json({ error: "Musictitle required field" });
  }

  if (!artist) {
    return res.status(400).json({ error: "artist required fields" });
  }

  if (!lyrics) {
    return res.status(400).json({ error: "lyrics required fields" });
  }

  if (!AlbumName) {
    return res.status(400).json({ error: "AlbumName required fields" });
  }

  // Extract music and banner files from the request
  const Music = req.files.Music[0];
  const Banner = req.files.Banner[0];

  if (!Music) {
    return res.status(400).json({ error: "Music required files" });
  }

  if (!Banner) {
    return res.status(400).json({ error: "Banner required files" });
  }

  // Process music details
  const AudioName = req.files.Music[0].originalname;
  const MusicName = sanitizeFileName(AudioName);
  const MusicKey = `${uuidv4()}-${MusicName}`;

  // Process banner details
  const file2Name = req.files.Banner[0].originalname;
  const BannerName = sanitizeFileName(file2Name);
  const Bannerkey = `${uuidv4()}-${BannerName}`

  const existingaudio = await Album.findOne({
    AlbumName: { $regex: new RegExp(`^${AlbumName}$`, 'i') },
  });

  if (!existingaudio) {
    return res.status(404).json({ error: "Album not found" });
  }

  try {
    // Set up parameters for uploading music file to S3
    const params1 = {
      Bucket: AWS_BUCKET_NAME,
      Key: `uploads/${MusicKey}`,
      Body: Music.buffer,
      ContentType: Music.mimetype,
    };

    // Set up parameters for uploading banner file to S3
    const params2 = {
      Bucket: AWS_BUCKET_NAME,
      Key: `uploads/${Bannerkey}`,
      Body: Banner.buffer,
      ContentType: Banner.mimetype,
    };

    // Create S3 upload commands for music and banner files
    const command1 = new PutObjectCommand(params1);
    const command2 = new PutObjectCommand(params2);

    // Upload music file to S3
    const uploaded1 = await s3client.send(command1);

    // Upload banner file to S3
    const uploaded2 = await s3client.send(command2);

    // Format lyrics (replace newline characters with '<br>')
    const formattedLyrics = lyrics.replace(/\n/g, "<br>");
``
    // Create a new audio entry in the database
    const audio = await Audio.create({
      Musictitle,
      artist,
      AlbumName,
      lyrics: formattedLyrics,
      MusicKey: MusicKey,
      BannerKey: Bannerkey,
      Audio_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params1.Key}`,
      Banner_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params2.Key}`,
      download_file: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params1.Key}`,
    });

    // Respond with success message and the created audio entry
    return res.status(201).json({
      success: "Audio added successfully",
      audio,
    });
  } catch (error) {
    // Handle errors by responding with the error details
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update audio details by ID.
 * @route PUT /api/audio/:id
 * @description Update details of a specific audio by ID.
 * @access Public
 * @param {string} req.params.id - The ID of the audio to update.
 * @param {object} req.body - The updated details including title, artist, description, and lyrics.
 * @returns {object} - Success message if details are updated successfully.
 * @throws {object} - Returns a 404 error if the audio is not found. Returns a 400 error if details are not updated.
 */
export const updateAudioDetails = async (req, res) => {
  // Destructure relevant fields from the request body
  const { Musictitle, artist, description, lyrics } = req.body;

  // Extract audio ID from the route parameters
  const audioId = req.params.id; // Assuming you pass the audio ID in the route URL

  try {
    // Create an object to store fields to be updated
    const updateFields: UpdateFields = {};

    // Check if each field is provided in the request body and add it to updateFields
    if (Musictitle) updateFields.Musictitle = Musictitle;
    if (artist) updateFields.artist = artist;
    if (description) updateFields.description = description;
    if (lyrics) updateFields.lyrics = lyrics;

    // Find and update the audio details in the database
    const audio = await Audio.findByIdAndUpdate(
      { _id: audioId },
      { $set: updateFields },
      { new: true } // Set the 'new' option to true to get the updated document
    );

    // Check if the audio details were found and updated
    if (!audio) {
      return res.status(404).json({ error: "Audio not found" });
    }

    // Create a comma-separated string of updated fields for the success message
    const updatedDetails = Object.keys(updateFields).join(", "); // Create a comma-separated string of updated fields

    // Respond with the success message and the updated audio details
    return res.status(200).json({
      success: `Details (${updatedDetails}) updated successfully`,
      audio,
    });
  } catch (error) {
    return res.status(400).json({ error: "Details not updated." });
  }
};

/**
 * Get all audio details.
 * @route GET /api/audio
 * @description Retrieve details of all audio entries.
 * @access Public
 * @returns {Array} - List of all audio details.
 * @throws {object} - Returns a 500 error if there is an error retrieving audio details.
 */
 
export const getallsongs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;

    const skip = (page - 1) * limit;

    const getallsongs = await Audio.find()
      .skip(skip)
      .limit(limit);

    const totalSongs = await Audio.countDocuments(); // Count total number of songs in the database

    return res.status(200).json({
      success: "Fetched songs",
      page,
      limit,
      totalSongs,
      totalPages: Math.ceil(totalSongs / limit),
      getallsongs,
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving audio details." });
  }
};

export const allsongs = async (req, res) => {
  try {
   


    const getallsongs = await Audio.find()
      
    return res.status(200).json({
      success: "Fetched songs",
      getallsongs,
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving audio details." });
  }
};


/**
 * Delete a song by ID, including associated files from S3 and the database.
 *
 * @route DELETE /api/audio/:id
 * @description Delete a specific audio entry by its unique identifier (ID),
 *              which includes the removal of associated audio and banner files
 *              from the S3 bucket and the deletion of the entry from the database.
 * @access Public
 * @param {string} id - The ID of the audio entry to be deleted.
 * @returns {Object} - A response object containing success or error messages.
 * @throws {Object} - An error object in case of unexpected errors during the deletion process.
 * 
 */
export const deletesongByID = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the details of the song before deletion
    const deletedSong = await Audio.findById(id);
    console.log(deletedSong);
    if (!deletedSong) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Delete the associated files from S3
    await deleteS3File(deletedSong.MusicKey);
    await deleteS3File(deletedSong.BannerKey);

    // Delete the song from the database
    const deletedAudio = await Audio.deleteOne({ _id: id });

    if (deletedAudio.deletedCount === 1) {
      return res.status(200).json({
        success: `Song '${deletedSong.Musictitle}' and associated files deleted successfully`,
      });
    } else {
      return res.status(500).json({ error: "Error deleting song" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error deleting audio details" });
  }
};



/**
 * Get audio details by ID.
 * @route GET /api/audio/:id
 * @description Retrieve details of a specific audio by ID.
 * @access Public
 * @param {string} req.params.id - The ID of the audio to retrieve.
 * @returns {object} - Details of the specified audio.
 * @throws {object} - Returns a 404 error if the audio is not found. Returns a 500 error if there is an error retrieving audio details.
 */
export const getAudioById = async (req, res) => {
  try {
    const { id } = req.params;
    const audio = await Audio.findById(id);

    if (!audio) {
      return res.status(404).json({ error: "Audio not found" });
    }
    res.status(200).json(audio);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving audio details" });
  }
};

/**
 * Get audio details by name or word in the title.
 * @route GET /api/audio/byName/:name
 * @description Retrieve audio details by name or word in the title.
 * @access Public
 * @param {string} req.params.name - The name or word to search for in the audio titles.
 * @returns {object} - Object containing audio details matching the specified name and word.
 * @throws {object} - Returns a 500 error if there is an error retrieving audio details.
 */
export const getAudioByName = async (req, res) => {
  // Extract the name parameter from the request
  const { name } = req.params;

  // Convert the name to lowercase for a case-insensitive search
  const lowercaseTitle = name.toLowerCase();

  try {
     
    const audioDetails = await Audio.find({
      Musictitle: { $regex: new RegExp(lowercaseTitle, "i") },
    });

    
      const results = {
        audioDetails,
      };
      res.status(200).json(results);
    // }
  } catch (error) {
    // Respond with a 500 error and an error message
    res.status(500).json({ error: "Error retrieving audio details" });
  }
};



const fetchAndLogRandomSongs = async () => {
  try {
    // Fetch six random songs
    const randomSongs = await Audio.aggregate([{ $sample: { size: 6 } }]);
     
    return randomSongs
     

  } catch (error) {
     
    return error
  
  }
};

// Schedule the task to run every 5 minutes

cron.schedule('*/5 * * * *', () => {
  fetchAndLogRandomSongs();
});

export const randomsongs = async (req, res) => {

  const ranadomsongs=await fetchAndLogRandomSongs();
  
  // console.log(ranadomsongs)
  res.status(200).json({
    success:
    ranadomsongs})

}