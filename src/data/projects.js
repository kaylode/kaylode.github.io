// Import images from public directory for Next.js
const Github = "/projects/github.png"
const FaceMaskRemoval = "/projects/facemask.png"
const VehicleTracking = "/projects/vehicle_tracking.gif"
const VNOCRToolBox = "/projects/vnocrtoolbox.png"
const Kai = "/projects/kai.jpg"
const Pothole = "/projects/pothole.png"
const TrafficEventRetrieval = "/projects/aic22.png"
const FoodAPI = "/projects/food_api.jpg"
const IVOS = "/projects/ivos.png"

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
    stars: 35,
    forks: 5,
    language: "Python",
    lastUpdated: "2025-05-05",
    openIssues: 2,
    tags: {
      "pytorch": "danger", 
      "computer-vision": "primary", 
      "object-detection": "success",
      "segmentation": "info",
      "classification": "warning",
      "template": "secondary"
    }
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
    stars: 99,
    forks: 31,
    language: "Python",
    lastUpdated: "2025-06-05",
    openIssues: 4,
    tags: {
      "pytorch": "danger", 
      "yolov5": "warning", 
      "object-tracking": "success",
      "deepsort": "info",
      "vehicle-counting": "primary"
    }
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
    stars: 12,
    forks: 0,
    language: "Python",
    lastUpdated: "2024-08-15",
    openIssues: 2,
    tags: {
      "pytorch": "danger", 
      "pytorch-lightning": "warning", 
      "retrieval": "success",
      "image-text-matching": "info",
      "aicitychallenge": "primary"
    }
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
    stars: 35,
    forks: 12,
    language: "Python",
    lastUpdated: "2025-07-10",
    openIssues: 5,
    tags: {
      "pytorch": "danger", 
      "gan": "success",
      "deep-learning": "primary",
      "image-inpainting": "info",
      "generative-adversarial-network": "warning"
    }
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
    stars: 6,
    forks: 1,
    language: "Python",
    lastUpdated: "2022-06-25",
    openIssues: 6,
    tags: {
      "discord-py": "primary", 
      "discord-bot": "warning",
      "computer-vision": "success",
      "gpt-3": "info",
      "voice-recognition": "danger"
    }
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
    stars: 123,
    forks: 31,
    language: "C++",
    lastUpdated: "2025-07-19",
    openIssues: 5,
    tags: {
      "ocr": "info", 
      "character-recognition": "primary",
      "text-detection": "success",
      "vietnamese-ocr": "warning",
      "object-detection": "danger",
      "toolbox": "secondary"
    }
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
    stars: 10,
    forks: 5,
    language: "Python",
    lastUpdated: "2025-06-24",
    openIssues: 0,
    tags: {
      "semantic-segmentation": "success", 
      "semi-supervised-learning": "info",
      "crack-segmentation": "warning",
      "pothole-segmentation": "primary"
    }
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
    stars: 333,
    forks: 99,
    language: "Python",
    lastUpdated: "2025-07-16",
    openIssues: 4,
    tags: {
      "pytorch": "danger", 
      "yolov5": "warning", 
      "object-detection": "success", 
      "food-analysis": "info",
      "deep-learning": "primary",
      "semantic-segmentation": "secondary",
      "efficientnet": "light"
    }
  },

  {
    id: 9,
    img: IVOS,
    title: "Interactive CT Volume Organ Segmentation",
    desc: "We present a novel two-staged method that employs various 2D-based techniques to deal with the 3D segmentation task. In most of the previous challenges, it is unlikely for 2D CNNs to be comparable with other 3D CNNs since 2D models can hardly capture temporal information. In light of that, we propose using the recent state-of-the-art technique in video object segmentation, combining it with other semi-supervised training techniques to leverage the extensive unlabeled data. Moreover, we introduce a way to generate pseudo-labeled data that is both plausible and consistent for further retraining by using uncertainty estimation.",
    demo: "",
    source: "https://github.com/kaylode/ivos",
    color: "light",
    text_color: "dark",
    stars: 9,
    forks: 4,
    language: "Python",
    lastUpdated: "2024-05-15",
    openIssues: 3,
    tags: {
      "pytorch": "danger", 
      "active-learning": "info",
      "medical": "primary",
      "ct-volumes": "success",
      "label-propagation": "warning",
      "pseudo-labeling": "secondary"
    }
  },

  
  
]


export default project_list
