import { atom, selector, selectorFamily } from "recoil";
import { getLocation, getPhoneNumber, getUserInfo } from "zmp-sdk";
import coffeeIcon from "static/category-coffee.svg";
import matchaIcon from "static/category-matcha.svg";
import foodIcon from "static/category-food.svg";
import milkteaIcon from "static/category-milktea.svg";
import drinksIcon from "static/category-drinks.svg";
import logo from "static/logo.png";
import { Category, CategoryId } from "types/category";
import { Product, Variant } from "types/product";
import { Cart } from "types/cart";
import { Notification } from "types/notification";
import { calculateDistance } from "utils/location";
import { Store } from "types/delivery";
import { calcFinalPrice, getDummyImage } from "utils/product";
import { wait } from "utils/async";

export const userState = selector({
  key: "user",
  get: () => getUserInfo({}).then((res) => res.userInfo),
});

export const categoriesState = selector<Category[]>({
  key: "categories",
  get: () => [
    { id: "vnptbg", name: "VNPT BG", icon: coffeeIcon },
    { id: "bdvbg", name: "Ban dân vận BG", icon: matchaIcon },
    { id: "tinhdoanbg", name: "Tỉnh đoàn BG", icon: foodIcon },
    { id: "ubndbg", name: "UBND tỉnh BG", icon: milkteaIcon },
    { id: "ldldbg", name: "Liên đoàn lao động BG", icon: drinksIcon },
  ],
});

const description = `There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes`;

export const productsState = selector<Product[]>({
  key: "products",
  get: async () => {
    await wait(2000);
    const variants: Variant[] = [
      {
        key: "size",
        label: "Kích cỡ",
        type: "single",
        default: "m",
        options: [
          {
            key: "s",
            label: "Nhỏ",
            priceChange: {
              type: "percent",
              percent: -0.2,
            },
          },
          {
            key: "m",
            label: "Vừa",
          },
          {
            key: "l",
            label: "To",
            priceChange: {
              type: "percent",
              percent: 0.2,
            },
          },
        ],
      },
      {
        key: "toping",
        label: "Topping",
        type: "multiple",
        default: ["t1", "t4"],
        options: [
          {
            key: "t1",
            label: "Trân châu",
            priceChange: {
              type: "fixed",
              amount: 5000,
            },
          },
          {
            key: "t2",
            label: "Bánh flan",
            priceChange: {
              type: "fixed",
              amount: 10000,
            },
          },
          {
            key: "t3",
            label: "Trang trí",
            priceChange: {
              type: "percent",
              percent: 0.15,
            },
          },
          {
            key: "t4",
            label: "Không lấy đá",
            priceChange: {
              type: "fixed",
              amount: -5000,
            },
          },
        ],
      },
    ];
    return [
      {
        id: 1,
        name: "Meeting 1",
        price: 35000,
        image: getDummyImage("product-square-1.jpg"),
        description,
        categoryId: ["vnptbg"],
        variants,
      },
      {
        id: 2,
        name: "Meeting 2",
        price: 45000,
        image: getDummyImage("product-square-2.jpg"),
        description,
        categoryId: ["vnptbg"],
        variants,
      },
      {
        id: 3,
        name: "Meeting 3",
        price: 30000,
        image: getDummyImage("product-square-3.jpg"),
        description,
        categoryId: ["tinhdoanbg"],
        variants,
      },
      {
        id: 4,
        name: "Meeting 4",
        price: 28000,
        image: getDummyImage("product-square-4.jpg"),
        description,
        categoryId: ["tinhdoanbg"],
        variants,
      },
      {
        id: 5,
        name: "Meeting 5",
        price: 35000,
        image: getDummyImage("product-square-5.jpg"),
        description,
        categoryId: ["bdvbg"],
        variants,
      },
      {
        id: 6,
        name: "Meeting 6",
        price: 38000,
        image: getDummyImage("product-square-6.jpg"),
        description,
        categoryId: ["ubndbg"],
        variants,
      },
      {
        id: 7,
        name: "Meeting 7",
        price: 32000,
        image: getDummyImage("product-square-7.jpg"),
        description,
        categoryId: ["vnptbg"],
        variants,
      },
      {
        id: 8,
        name: "Meeting 8",
        price: 25000,
        image: getDummyImage("product-square-8.jpg"),
        description,
        categoryId: ["bdvbg"],
        variants,
      },
      {
        id: 9,
        name: "Meeting 9",
        image: getDummyImage("product-rect-1.jpg"),
        price: 25000,
        sale: {
          type: "percent",
          percent: 0.2,
        },
        description,
        categoryId: ["ubndbg"],
        variants,
      },
      {
        id: 10,
        name: "Meeting 10",
        image: getDummyImage("product-rect-2.jpg"),
        price: 57000,
        sale: {
          type: "fixed",
          amount: 7000,
        },
        description,
        categoryId: ["vnptbg"],
        variants,
      },
      {
        id: 11,
        name: "Meeting 11",
        price: 55000,
        image: getDummyImage("product-rect-3.jpg"),
        description,
        categoryId: ["ubndbg"],
        variants,
        sale: {
          type: "percent",
          percent: 0.5,
        },
      },
    ];
  },
});

export const recommendProductsState = selector<Product[]>({
  key: "recommendProducts",
  get: ({ get }) => {
    const products = get(productsState);
    return products.filter((p) => p.sale);
  },
});

export const selectedCategoryIdState = atom({
  key: "selectedCategoryId",
  default: "vnptbg",
});

export const productsByCategoryState = selectorFamily<Product[], CategoryId>({
  key: "productsByCategory",
  get:
    (categoryId) =>
    ({ get }) => {
      const allProducts = get(productsState);
      return allProducts.filter((product) =>
        product.categoryId.includes(categoryId)
      );
    },
});

export const cartState = atom<Cart>({
  key: "cart",
  default: [],
});

export const totalQuantityState = selector({
  key: "totalQuantity",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => total + item.quantity, 0);
  },
});

export const totalPriceState = selector({
  key: "totalPrice",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce(
      (total, item) =>
        total + item.quantity * calcFinalPrice(item.product, item.options),
      0
    );
  },
});

export const notificationsState = atom<Notification[]>({
  key: "notifications",
  default: [
    {
      id: 1,
      image: logo,
      title: "Chào bạn mới",
      content:
        "Cảm ơn đã sử dụng Meeting App, bạn có thể dùng ứng dụng này để tiết kiệm thời gian xây dựng",
    },
    {
      id: 2,
      image: logo,
      title: "Bình chọn cuộc họp",
      content: "Hãy thăm gia bình chọn cho cuộc họp",
    },
  ],
});

export const keywordState = atom({
  key: "keyword",
  default: "",
});

export const resultState = selector<Product[]>({
  key: "result",
  get: async ({ get }) => {
    const keyword = get(keywordState);
    if (!keyword.trim()) {
      return [];
    }
    const products = get(productsState);
    await wait(500);
    return products.filter((product) =>
      product.name.trim().toLowerCase().includes(keyword.trim().toLowerCase())
    );
  },
});

export const storesState = atom<Store[]>({
  key: "stores",
  default: [
    {
      id: 1,
      name: "VNG Campus Store",
      address:
        "Khu chế xuất Tân Thuận, Z06, Số 13, Tân Thuận Đông, Quận 7, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.741639,
      long: 106.714632,
    },
    {
      id: 2,
      name: "The Independence Palace",
      address:
        "135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.779159,
      long: 106.695271,
    },
    {
      id: 3,
      name: "Saigon Notre-Dame Cathedral Basilica",
      address:
        "1 Công xã Paris, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.779738,
      long: 106.699092,
    },
    {
      id: 4,
      name: "Bình Quới Tourist Village",
      address:
        "1147 Bình Quới, phường 28, Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.831098,
      long: 106.733128,
    },
    {
      id: 5,
      name: "Củ Chi Tunnels",
      address: "Phú Hiệp, Củ Chi, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 11.051655,
      long: 106.494249,
    },
  ],
});

export const nearbyStoresState = selector({
  key: "nearbyStores",
  get: ({ get }) => {
    // Get the current location from the locationState atom
    const location = get(locationState);

    // Get the list of stores from the storesState atom
    const stores = get(storesState);

    // Calculate the distance of each store from the current location
    if (location) {
      const storesWithDistance = stores.map((store) => ({
        ...store,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          store.lat,
          store.long
        ),
      }));

      // Sort the stores by distance from the current location
      const nearbyStores = storesWithDistance.sort(
        (a, b) => a.distance - b.distance
      );

      return nearbyStores;
    }
    return [];
  },
});

export const selectedStoreIndexState = atom({
  key: "selectedStoreIndex",
  default: 0,
});

export const selectedStoreState = selector({
  key: "selectedStore",
  get: ({ get }) => {
    const index = get(selectedStoreIndexState);
    const stores = get(nearbyStoresState);
    return stores[index];
  },
});

export const selectedDeliveryTimeState = atom({
  key: "selectedDeliveryTime",
  default: +new Date(),
});

export const requestLocationTriesState = atom({
  key: "requestLocationTries",
  default: 0,
});

export const requestPhoneTriesState = atom({
  key: "requestPhoneTries",
  default: 0,
});

export const locationState = selector<
  { latitude: string; longitude: string } | false
>({
  key: "location",
  get: async ({ get }) => {
    const requested = get(requestLocationTriesState);
    if (requested) {
      const { latitude, longitude, token } = await getLocation({
        fail: console.warn,
      });
      if (latitude && longitude) {
        return { latitude, longitude };
      }
      if (token) {
        console.warn(
          "Sử dụng token này để truy xuất vị trí chính xác của người dùng",
          token
        );
        console.warn(
          "Chi tiết tham khảo: ",
          "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
        );
        console.warn("Giả lập vị trí mặc định: VNG Campus");
        return {
          latitude: "10.7287",
          longitude: "106.7317",
        };
      }
    }
    return false;
  },
});

export const phoneState = selector<string | boolean>({
  key: "phone",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    if (requested) {
      const { number, token } = await getPhoneNumber({ fail: console.warn });
      if (number) {
        return number;
      }
      console.warn(
        "Sử dụng token này để truy xuất số điện thoại của người dùng",
        token
      );
      console.warn(
        "Chi tiết tham khảo: ",
        "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
      );
      console.warn("Giả lập số điện thoại mặc định: 0337076898");
      return "0337076898";
    }
    return false;
  },
});
