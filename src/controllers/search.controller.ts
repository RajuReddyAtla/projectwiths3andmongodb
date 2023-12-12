
import mongoose from "mongoose";
import Article from '@/models/article.model' 
import Audio from "@/models/audio.model"
import Message from "@/models/message.model";
import Magazine from '@/models/magazine.model'

// Define a function for searching across different schemas
 export const search =async (req, res) => {
        const {name} = req.params;//Extract the search query from the request parameters
        const lowercaseTitle = name.toLowerCase();
        // console.log(lowercaseTitle)
        try {
          // Search across all schemas
           const articles = await Article.find({ ArticleTitle: { $regex: new RegExp(lowercaseTitle, "i") } });
          
          // Search for magazines using full-text search on an unspecified fiels (replace 'query' with an appropriate field name)
          const messages = await Message.find({ MessageTitle: { $regex: new RegExp(lowercaseTitle, "i") } });
          const magazines = await Magazine.find({ MagazineTitle: { $regex: new RegExp(lowercaseTitle, "i") } });
          const songs = await Audio.find({ Musictitle: { $regex: new RegExp(lowercaseTitle, "i") } });

      if(articles.length===0 && messages.length===0 && magazines.length===0 && songs.length===0){
          return res.status(400).json("No results found")
      }

          // Combine and send the results
          const results = { articles, messages, magazines, songs };

          for (const key in results) {
            if (results[key].length === 0) {
              // Remove properties with empty arrays
              delete results[key];
            }
          }
          
          res.json(results);
        } catch (error) {
          //Log any errors that occur during the search process
          console.error(error);
          //Respond with a 500 Internal Server Error if an  error ocurs
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };