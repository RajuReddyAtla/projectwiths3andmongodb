import HomeRoute from '@routes/index.route';
import audioRoutes from "@routes/audio.route";
import userRoutes from "@routes/user.route"
import adminRoutes from "@routes/admin.route"
import S3Routes from "@routes/magazine.route"
import bannerRoutes from "@routes/banner.route"
import MessageRoutes from "@routes/message.route"
import articleRoutes from "@routes/article.route"
import SearchRoute from "@routes/search.route"
import AlbumRoute from "@routes/album.route"
import videoRoutes from "@routes/video.route"
import MainFolder from "@routes/SubFolderPanchayithe/MainFolder.route"
import SubFolder from "@routes/SubFolderPanchayithe/SubFolder.route"
import AudioMesssage from "@routes/SubFolderPanchayithe/AudioMessage.route"
import contactRoutes from "@routes/contactus.route";
import shortRoutes from "@routes/shorts.route";
import MainFolderRoute from "@routes/SubFolderVideo/MainFolder.route";
import SubFolderRoute from "@routes/SubFolderVideo/SubFolder.route";
import VideoRoute from "@routes/SubFolderVideo/Video.route"

 const routes = [

  {
    path: '/home',
    func: HomeRoute,
  },
  {
    path: '/audio',
    func: audioRoutes,
  },
  {
    path: '/user',
    func: userRoutes,
  },

  {
    path: '/admin',
    func: adminRoutes,
  },
  {
    path: '/magazine',
    func: S3Routes,
  },
  {
    path: '/banner',
    func: bannerRoutes,
  },
  {
    path: '/message',
    func: MessageRoutes,
  },
  {
    path: '/article',
    func: articleRoutes,
  },
  {
    path: '/search',
    func: SearchRoute,
  },

  {
    path: '/album',
    func: AlbumRoute,
  },
   
  {
    path: '/video',
    func: videoRoutes,
  },
   
  {
    path: '/mainfolder',
    func: MainFolder,
  },
  {
    path: '/subfolder',
    func: SubFolder,
  },
  {
    path: '/audiomessage',
    func: AudioMesssage,
  },
   {
    path: '/mainvideofolder',
    func: MainFolderRoute,
  },
  {
    path: '/subvideofolder',
    func: SubFolderRoute,
  },

  {
    path: '/videomessage',
    func: VideoRoute,
  },
  {
    path: '/ContactUs',
    func: contactRoutes,
  },
  {
    path: '/shorts',
    func: shortRoutes,
  },


];

export default routes;