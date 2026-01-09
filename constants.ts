import { Meal, MealType } from './types';

export const SEED_MEALS: Meal[] = [
  {
    id: 'm1',
    name: 'Ức Gà Nướng & Quinoa',
    description: 'Ức gà nướng thảo mộc ăn kèm hạt Quinoa, bông cải xanh và sốt chanh leo ít béo.',
    type: MealType.FIT_PLUS,
    calories: 650,
    protein: 55,
    carbs: 60,
    fat: 15,
    ingredients: [{name: 'Ức Gà', removable: false}, {name: 'Hạt Quinoa', removable: false}, {name: 'Bông Cải', removable: true}, {name: 'Sốt Chanh', removable: true}],
    imageUrl: 'https://i.blogs.es/b785a7/pollo-brocoli-quinoa-naranja/1366_521.jpg',
    isActive: true
  },
  {
    id: 'm2',
    name: 'Cá Hồi Áp Chảo Măng Tây',
    description: 'Phi lê cá hồi áp chảo dùng kèm măng tây hấp và cơm gạo lứt.',
    type: MealType.FIT_MINUS,
    calories: 450,
    protein: 35,
    carbs: 30,
    fat: 18,
    ingredients: [{name: 'Cá Hồi', removable: false}, {name: 'Măng Tây', removable: true}, {name: 'Gạo Lứt', removable: false}],
    imageUrl: 'https://gofood.vn//upload/r/tong-hop-tin-tuc/huong-dan-mon-ngon/ca-hoi-ap-chao-mang-tay-chanh-leo.jpg',
    isActive: true
  },
  {
    id: 'm3',
    name: 'Bò Xào Lúc Lắc Healthy',
    description: 'Thịt bò nạc cắt khối xào với ớt chuông, đậu hà lan và sốt tương ít muối.',
    type: MealType.FIT_PLUS,
    calories: 700,
    protein: 60,
    carbs: 65,
    fat: 20,
    ingredients: [{name: 'Thịt Bò', removable: false}, {name: 'Ớt Chuông', removable: true}, {name: 'Sốt Tương', removable: true}],
    imageUrl: 'https://i.ytimg.com/vi/7J9p8w0MadY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDqlCnB1GOu-DC0SaPDMwJO5HAgTQ',
    isActive: true
  },
  {
    id: 'm4',
    name: 'Cơm Chay Buddha Bowl',
    description: 'Đậu gà, khoai lang nướng, cải xoăn và bơ sáp Đà Lạt sốt mè.',
    type: MealType.FIT_MINUS,
    calories: 400,
    protein: 15,
    carbs: 50,
    fat: 18,
    ingredients: [{name: 'Đậu Gà', removable: false}, {name: 'Quả Bơ', removable: true}, {name: 'Sốt Mè', removable: true}],
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTMFKL8kvBlN12h1esZ8MZjR6A9uBcDxL7yw&s',
    isActive: true
  },
  {
    id: 'm5',
    name: 'Xíu Mại Gà & Mì Bí Ngòi',
    description: 'Viên gà xíu mại handmade ăn kèm mì bí ngòi (zoodles) và sốt cà chua tươi.',
    type: MealType.FIT_MINUS,
    calories: 380,
    protein: 40,
    carbs: 15,
    fat: 12,
    ingredients: [{name: 'Thịt Gà', removable: false}, {name: 'Bí Ngòi', removable: false}, {name: 'Sốt Cà Chua', removable: true}],
    imageUrl: 'https://giadinh.mediacdn.vn/zoom/740_463/2020/12/24/photo-1-16087844017321074827329-crop-16087844542601654302662.jpg',
    isActive: true
  },
  {
    id: 'm6',
    name: 'Bít Tết & Khoai Lang Nghiền',
    description: 'Thăn bò nướng vừa chín tới ăn kèm khoai lang nghiền mịn và đậu que.',
    type: MealType.FIT_PLUS,
    calories: 750,
    protein: 65,
    carbs: 55,
    fat: 25,
    ingredients: [{name: 'Thăn Bò', removable: false}, {name: 'Khoai Lang', removable: false}, {name: 'Bơ Lạt', removable: true}],
    imageUrl: 'https://media3.bosch-home.com/Images/600x/MCIM02490132_CB116-MD-GrilledSteakandSides.jpg',
    isActive: true
  }
];

export const MOCK_PRICES = {
  3: 450000,
  7: 950000,
  30: 3800000
};