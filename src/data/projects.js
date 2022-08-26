import Github from "../assets/projects/github.png"
import FaceMaskRemoval from "../assets/projects/facemask.png"
import VehicleTracking from "../assets/projects/vehicle_tracking.gif"
import VNOCRToolBox from "../assets/projects/vnocrtoolbox.png"
import Kai from "../assets/projects/kai.jpg"
import Pothole from "../assets/projects/pothole.png"
import TrafficEventRetrieval from "../assets/projects/aic22.png"
import FoodAPI from "../assets/projects/food_api.jpg"

// 'Primary',
// 'Secondary',
// 'Success',
// 'Danger',
// 'Warning',
// 'Info',
// 'Light',
// 'Dark',

// eslint-disable-next-line import/no-anonymous-default-export
export const project_list = [
  {
    id: 1,
    img: Github,
    title: "THESEUS",
    desc: "A general template for all Pytorch deep learning projects.",
    demo: "",
    source: "https://github.com/kaylode/theseus",
    color: "light",
    text_color: "dark",
    tags: {pytorch:"danger", framework: "primary"}
  },
  
  {
    id: 2,
    img: VehicleTracking,
    title: "Vehicle Counting",
    desc: "An application employed tracking and counting vehicle from surveillance camera in Vietnam.",
    demo: "",
    source: "https://github.com/kaylode/vehicle-counting",
    color: "light",
    text_color: "dark",
    tags: {pytorch:"danger", yolov5:"warning", "object tracking": "success"}
  },

  {
    id: 7,
    img: TrafficEventRetrieval,
    title: "Video Traffic Event Retrieval",
    desc: "We built a pipeline to perform retrieving relevant video clips that match the given prompt. The clips and prompts describe traffic events captured from surveillance camera. This method achieved runner-up award in AI City Challenge 2022",
    demo: "",
    source: "https://github.com/nhtlongcs/AIC2022-VER",
    color: "light",
    text_color: "dark",
    tags: {pytorch:"danger", "streamlit":"warning", "video retrieval": "success"}
  },
  
  {
    id: 3,
    img: FaceMaskRemoval,
    title: "Facemask Removal",
    desc: "An application that can remove the facemask from the portrait in an image.",
    demo: "",
    source: "https://github.com/kaylode/facemask-removal",
    color: "light",
    text_color: "dark",
    tags: {pytorch:"danger", GAN:"success"}
  },

  {
    id: 5,
    img: Kai,
    title: "K.A.I",
    desc: "K.A.I is created as a Discord bot written using discord.py that can do a lot of things an AI can do. From basic usage such as customable alarm system, streaming music, translating multiple languages, searching wikipedia, to even more intelligence tasks like computer vision (classification, detection, segmentation, etc), natural language processing (telling jokes, answering questions, chatting)* responding with voice, or even being voice-controlled.",
    demo: "",
    source: "https://github.com/kaylode/kai",
    color: "light",
    text_color: "dark",
    tags: {"discord.py":"primary", "discord.js":"warning"}
  },

  

  {
    id: 4,
    img: VNOCRToolBox,
    title: "Vietnamese OCR Toolbox",
    desc: "A toolbox to retrieve Vietnamese text from receipts or document papers.",
    demo: "",
    source: "https://github.com/kaylode/vietnamese-ocr-toolbox",
    color: "light",
    text_color: "dark",
    tags: {pytorch:"danger", OCR:"info"}
  },

  

  {
    id: 6,
    img: Pothole,
    title: "Street Pothole Segmentation",
    desc: "We implemented semi-supervised algorithms to detect and segment road cracks and street potholes in the wild",
    demo: "",
    source: "https://github.com/kaylode/shrec22-pothole",
    color: "light",
    text_color: "dark",
    tags: {pytorch:"danger", "semi-supervised":"info", "semantic segmentation": "success"}
  },

  {
    id: 8,
    img: FoodAPI,
    title: "Meal Analysis Web-application",
    desc: "We deployed a web application where user can upload images or videos of their dishes to get full analysis of the ingredients and nutritions of it. Food ingredients are detected using object detection deep learning algorithm and their information is retrieved from online APIs.",
    demo: "",
    source: "https://github.com/lannguyen0910/food-recognition",
    color: "light",
    text_color: "dark",
    tags: {pytorch:"danger", "flask-server":"dark", yolov5:"warning", "object detection": "success", "web-application":"info"}
  },

  
  
]


export default project_list
