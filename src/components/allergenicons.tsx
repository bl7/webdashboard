// allergenIcons.ts

import {
  FaEgg,
  FaFish,
  FaSeedling,
  FaBreadSlice,
  FaAppleAlt,
  FaCarrot,
  FaLeaf,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaCheese,
  FaWineBottle,
  FaPepperHot,
  FaLemon,
  FaCoffee,
  FaCandyCane,
} from "react-icons/fa"
import {
  GiCoconuts,
  GiMilkCarton,
  GiWheat,
  GiPeanut,
  GiShrimp,
  GiSesame,
  GiMussel,
  GiGrapes,
  GiCherry,
  GiPeach,
  GiStrawberry,
  GiKiwiFruit,
  GiPineapple,
  GiAvocado,
  GiBanana,
  GiTomato,
  GiGarlic,
  GiChocolateBar,
  GiCorn,
  GiPotato,
  GiMeat,
  GiChickenOven,
  GiPig,
  GiCow,
} from "react-icons/gi"
import { LuBean } from "react-icons/lu"
import { TbMilk, TbFish, TbEgg, TbPlant, TbBottle } from "react-icons/tb"
import { MdOutlineGrain, MdOutlineLocalFlorist, MdOutlineScience } from "react-icons/md"

export const allergenIconMap: Record<string, JSX.Element> = {
  // === UK 14 MAJOR ALLERGENS ===

  // 1. Cereals containing gluten
  gluten: <FaBreadSlice className="mr-1 inline-block" />,
  wheat: <GiWheat className="mr-1 inline-block" />,
  barley: <MdOutlineGrain className="mr-1 inline-block" />,
  rye: <MdOutlineGrain className="mr-1 inline-block" />,
  oats: <MdOutlineGrain className="mr-1 inline-block" />,
  spelt: <MdOutlineGrain className="mr-1 inline-block" />,
  kamut: <MdOutlineGrain className="mr-1 inline-block" />,

  // 2. Crustaceans
  crustaceans: <GiShrimp className="mr-1 inline-block" />,
  shrimp: <GiShrimp className="mr-1 inline-block" />,
  prawns: <GiShrimp className="mr-1 inline-block" />,
  crab: <GiShrimp className="mr-1 inline-block" />,
  lobster: <GiShrimp className="mr-1 inline-block" />,
  crayfish: <GiShrimp className="mr-1 inline-block" />,

  // 3. Eggs
  eggs: <FaEgg className="mr-1 inline-block" />,
  egg: <FaEgg className="mr-1 inline-block" />,

  // 4. Fish
  fish: <FaFish className="mr-1 inline-block" />,
  salmon: <FaFish className="mr-1 inline-block" />,
  tuna: <FaFish className="mr-1 inline-block" />,
  cod: <FaFish className="mr-1 inline-block" />,
  sardines: <FaFish className="mr-1 inline-block" />,
  anchovies: <FaFish className="mr-1 inline-block" />,

  // 5. Peanuts (groundnuts)
  peanuts: <GiPeanut className="mr-1 inline-block" />,
  peanut: <GiPeanut className="mr-1 inline-block" />,
  groundnuts: <GiPeanut className="mr-1 inline-block" />,

  // 6. Soybeans
  soy: <LuBean className="mr-1 inline-block" />,
  soya: <LuBean className="mr-1 inline-block" />,
  soybeans: <LuBean className="mr-1 inline-block" />,

  // 7. Milk (including lactose)
  milk: <TbMilk className="mr-1 inline-block" />,
  dairy: <GiMilkCarton className="mr-1 inline-block" />,
  lactose: <TbMilk className="mr-1 inline-block" />,
  cheese: <FaCheese className="mr-1 inline-block" />,
  butter: <FaCheese className="mr-1 inline-block" />,
  cream: <TbMilk className="mr-1 inline-block" />,
  yogurt: <TbMilk className="mr-1 inline-block" />,
  yoghurt: <TbMilk className="mr-1 inline-block" />,

  // 8. Nuts (tree nuts)
  nuts: <GiCoconuts className="mr-1 inline-block" />,
  almonds: <GiCoconuts className="mr-1 inline-block" />,
  hazelnuts: <GiCoconuts className="mr-1 inline-block" />,
  walnuts: <GiCoconuts className="mr-1 inline-block" />,
  cashews: <GiCoconuts className="mr-1 inline-block" />,
  pecans: <GiCoconuts className="mr-1 inline-block" />,
  brazil: <GiCoconuts className="mr-1 inline-block" />,
  pistachios: <GiCoconuts className="mr-1 inline-block" />,
  macadamia: <GiCoconuts className="mr-1 inline-block" />,
  chestnuts: <GiCoconuts className="mr-1 inline-block" />,

  // 9. Celery
  celery: <FaLeaf className="mr-1 inline-block" />,
  celeriac: <FaLeaf className="mr-1 inline-block" />,

  // 10. Mustard

  // 11. Sesame seeds
  sesame: <GiSesame className="mr-1 inline-block" />,

  // 12. Sulphur dioxide and sulphites
  sulphites: <MdOutlineScience className="mr-1 inline-block" />,
  sulfites: <MdOutlineScience className="mr-1 inline-block" />,
  sulphur: <MdOutlineScience className="mr-1 inline-block" />,

  // 13. Lupin
  lupin: <MdOutlineLocalFlorist className="mr-1 inline-block" />,
  lupine: <MdOutlineLocalFlorist className="mr-1 inline-block" />,

  // 14. Molluscs
  molluscs: <GiMussel className="mr-1 inline-block" />,
  mollusks: <GiMussel className="mr-1 inline-block" />,
  mussels: <GiMussel className="mr-1 inline-block" />,
  clams: <GiMussel className="mr-1 inline-block" />,
  oysters: <GiMussel className="mr-1 inline-block" />,
  scallops: <GiMussel className="mr-1 inline-block" />,
  squid: <GiMussel className="mr-1 inline-block" />,
  octopus: <GiMussel className="mr-1 inline-block" />,
  snails: <GiMussel className="mr-1 inline-block" />,

  // === OTHER COMMON ALLERGENS ===

  // Fruits
  apple: <FaAppleAlt className="mr-1 inline-block" />,
  apples: <FaAppleAlt className="mr-1 inline-block" />,
  strawberry: <GiStrawberry className="mr-1 inline-block" />,
  strawberries: <GiStrawberry className="mr-1 inline-block" />,
  kiwi: <GiKiwiFruit className="mr-1 inline-block" />,
  pineapple: <GiPineapple className="mr-1 inline-block" />,
  banana: <GiBanana className="mr-1 inline-block" />,
  bananas: <GiBanana className="mr-1 inline-block" />,
  peach: <GiPeach className="mr-1 inline-block" />,
  peaches: <GiPeach className="mr-1 inline-block" />,
  cherry: <GiCherry className="mr-1 inline-block" />,
  cherries: <GiCherry className="mr-1 inline-block" />,
  grapes: <GiGrapes className="mr-1 inline-block" />,
  avocado: <GiAvocado className="mr-1 inline-block" />,
  citrus: <FaLemon className="mr-1 inline-block" />,
  orange: <FaLemon className="mr-1 inline-block" />,
  lemon: <FaLemon className="mr-1 inline-block" />,
  lime: <FaLemon className="mr-1 inline-block" />,
  grapefruit: <FaLemon className="mr-1 inline-block" />,
  mango: <FaAppleAlt className="mr-1 inline-block" />,
  papaya: <FaAppleAlt className="mr-1 inline-block" />,
  melon: <FaAppleAlt className="mr-1 inline-block" />,
  watermelon: <FaAppleAlt className="mr-1 inline-block" />,

  // Vegetables
  tomato: <GiTomato className="mr-1 inline-block" />,
  tomatoes: <GiTomato className="mr-1 inline-block" />,
  potato: <GiPotato className="mr-1 inline-block" />,
  potatoes: <GiPotato className="mr-1 inline-block" />,
  carrot: <FaCarrot className="mr-1 inline-block" />,
  carrots: <FaCarrot className="mr-1 inline-block" />,
  garlic: <GiGarlic className="mr-1 inline-block" />,
  corn: <GiCorn className="mr-1 inline-block" />,
  maize: <GiCorn className="mr-1 inline-block" />,
  bell_pepper: <FaPepperHot className="mr-1 inline-block" />,
  peppers: <FaPepperHot className="mr-1 inline-block" />,
  cucumber: <FaLeaf className="mr-1 inline-block" />,
  lettuce: <FaLeaf className="mr-1 inline-block" />,
  spinach: <FaLeaf className="mr-1 inline-block" />,
  broccoli: <FaLeaf className="mr-1 inline-block" />,
  cauliflower: <FaLeaf className="mr-1 inline-block" />,
  cabbage: <FaLeaf className="mr-1 inline-block" />,

  // Herbs & Spices
  ginger: <FaSeedling className="mr-1 inline-block" />,
  parsley: <FaLeaf className="mr-1 inline-block" />,
  basil: <FaLeaf className="mr-1 inline-block" />,
  oregano: <FaLeaf className="mr-1 inline-block" />,
  thyme: <FaLeaf className="mr-1 inline-block" />,
  rosemary: <FaLeaf className="mr-1 inline-block" />,
  dill: <FaLeaf className="mr-1 inline-block" />,
  mint: <FaLeaf className="mr-1 inline-block" />,

  // Legumes
  beans: <FaSeedling className="mr-1 inline-block" />,
  lentils: <FaSeedling className="mr-1 inline-block" />,
  chickpeas: <FaSeedling className="mr-1 inline-block" />,
  peas: <FaSeedling className="mr-1 inline-block" />,
  lima_beans: <FaSeedling className="mr-1 inline-block" />,
  kidney_beans: <FaSeedling className="mr-1 inline-block" />,
  black_beans: <FaSeedling className="mr-1 inline-block" />,

  // Meats
  beef: <GiCow className="mr-1 inline-block" />,
  pork: <GiPig className="mr-1 inline-block" />,
  chicken: <GiChickenOven className="mr-1 inline-block" />,
  turkey: <GiChickenOven className="mr-1 inline-block" />,
  lamb: <GiMeat className="mr-1 inline-block" />,
  duck: <GiChickenOven className="mr-1 inline-block" />,

  // Other common allergens
  chocolate: <GiChocolateBar className="mr-1 inline-block" />,
  cocoa: <GiChocolateBar className="mr-1 inline-block" />,
  coffee: <FaCoffee className="mr-1 inline-block" />,
  tea: <FaLeaf className="mr-1 inline-block" />,
  alcohol: <FaWineBottle className="mr-1 inline-block" />,
  wine: <FaWineBottle className="mr-1 inline-block" />,
  beer: <FaWineBottle className="mr-1 inline-block" />,
  yeast: <TbPlant className="mr-1 inline-block" />,
  vinegar: <TbBottle className="mr-1 inline-block" />,

  // Food additives
  msg: <MdOutlineScience className="mr-1 inline-block" />,
  artificial_colors: <MdOutlineScience className="mr-1 inline-block" />,
  artificial_flavors: <MdOutlineScience className="mr-1 inline-block" />,
  preservatives: <MdOutlineScience className="mr-1 inline-block" />,
  aspartame: <MdOutlineScience className="mr-1 inline-block" />,
  tartrazine: <MdOutlineScience className="mr-1 inline-block" />,
  benzoates: <MdOutlineScience className="mr-1 inline-block" />,
  nitrates: <MdOutlineScience className="mr-1 inline-block" />,

  // Seeds
  sunflower_seeds: <GiSesame className="mr-1 inline-block" />,
  pumpkin_seeds: <GiSesame className="mr-1 inline-block" />,
  poppy_seeds: <GiSesame className="mr-1 inline-block" />,
  flax_seeds: <GiSesame className="mr-1 inline-block" />,
  chia_seeds: <GiSesame className="mr-1 inline-block" />,

  // Unusual but documented allergens
  rice: <MdOutlineGrain className="mr-1 inline-block" />,
  buckwheat: <MdOutlineGrain className="mr-1 inline-block" />,
  quinoa: <MdOutlineGrain className="mr-1 inline-block" />,
  amaranth: <MdOutlineGrain className="mr-1 inline-block" />,
  coconut: <GiCoconuts className="mr-1 inline-block" />,
  gelatin: <MdOutlineScience className="mr-1 inline-block" />,
  carrageenan: <MdOutlineScience className="mr-1 inline-block" />,
  latex: <MdOutlineScience className="mr-1 inline-block" />,

  // Oral Allergy Syndrome related
  birch_pollen: <MdOutlineLocalFlorist className="mr-1 inline-block" />,
  ragweed_pollen: <MdOutlineLocalFlorist className="mr-1 inline-block" />,
  grass_pollen: <MdOutlineLocalFlorist className="mr-1 inline-block" />,

  // fallback for unknown allergens
  unknown: <FaQuestionCircle className="mr-1 inline-block" />,
  other: <FaExclamationTriangle className="mr-1 inline-block" />,
  default: <FaExclamationTriangle className="mr-1 inline-block" />,
}

// Helper function to get icon for allergen
export const getAllergenIcon = (allergen: string): JSX.Element => {
  const normalizedAllergen = allergen.toLowerCase().replace(/\s+/g, "_")
  return allergenIconMap[normalizedAllergen] || allergenIconMap.default
}

// Categories for easier management
export const allergenCategories = {
  ukMajor14: [
    "gluten",
    "crustaceans",
    "eggs",
    "fish",
    "peanuts",
    "soy",
    "milk",
    "nuts",
    "celery",
    "mustard",
    "sesame",
    "sulphites",
    "lupin",
    "molluscs",
  ],
  fruits: [
    "apple",
    "strawberry",
    "kiwi",
    "pineapple",
    "banana",
    "peach",
    "cherry",
    "grapes",
    "avocado",
    "citrus",
    "mango",
    "papaya",
  ],
  vegetables: [
    "tomato",
    "potato",
    "carrot",
    "onion",
    "garlic",
    "corn",
    "peppers",
    "cucumber",
    "lettuce",
    "spinach",
  ],
  spices: ["ginger", "turmeric", "cumin", "coriander", "cinnamon", "nutmeg", "paprika", "vanilla"],
  legumes: ["beans", "lentils", "chickpeas", "peas", "lima_beans", "kidney_beans", "black_beans"],
  additives: [
    "msg",
    "artificial_colors",
    "artificial_flavors",
    "preservatives",
    "aspartame",
    "tartrazine",
    "benzoates",
    "nitrates",
  ],
}
