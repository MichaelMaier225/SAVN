import { useCallback, useEffect, useMemo, useState } from "react"

import {
  getLanguage,
  setLanguage,
  subscribeToLanguage,
  Language,
} from "../store/settings"

type TranslationKey =
  | "analytics"
  | "analyticsTitle"
  | "appLanguage"
  | "avgSale"
  | "bestMarginItem"
  | "bulkRestock"
  | "businessHealth"
  | "cancel"
  | "changeLanguageHelper"
  | "currency"
  | "currencyHelper"
  | "daysTracked"
  | "enterQuantity"
  | "enterValidQuantityTitle"
  | "enterValidQuantityBody"
  | "enterValidTotalTitle"
  | "enterValidTotalBody"
  | "expenses"
  | "estimatedTotal"
  | "explore"
  | "exploreIntro"
  | "fileBasedRoutingBody"
  | "fileBasedRoutingBody2"
  | "fileBasedRoutingTitle"
  | "imagesBody"
  | "imagesTitle"
  | "learnMore"
  | "lightDarkModeBody"
  | "lightDarkModeTitle"
  | "platformSupportBody"
  | "platformSupportTitle"
  | "animationsBody"
  | "animationsBody2"
  | "animationsIosBody"
  | "animationsTitle"
  | "grossMargin"
  | "grossProfit"
  | "holdRestock"
  | "inventory"
  | "inventoryValue"
  | "inventoryWatch"
  | "lifetimeRevenue"
  | "language"
  | "lowStock"
  | "mostRestockedItem"
  | "mostSoldItem"
  | "apply"
  | "periodMonth"
  | "periodToday"
  | "periodWeek"
  | "periodYear"
  | "potentialRevenue"
  | "noRestocks"
  | "noSales"
  | "quantity"
  | "restock"
  | "restockSpend"
  | "sales"
  | "salesLogged"
  | "profit"
  | "productInsights"
  | "qtyUnitCost"
  | "revenue"
  | "restocked"
  | "sold"
  | "salesOverview"
  | "settings"
  | "settingsTitle"
  | "slowMover"
  | "stockHealthy"
  | "topRevenueItem"
  | "totalCost"
  | "totalSales"
  | "undo"
  | "vendors"
  | "vndRateHelper"
  | "vndRateLabel"
  | "currencyUSD"
  | "currencyVND"
  | "activeItems"
  | "activate"
  | "activeProducts"
  | "addToCatalog"
  | "archive"
  | "archiveProductBody"
  | "archiveProductTitle"
  | "catalogHelper"
  | "costPerUnit"
  | "deactivate"
  | "edit"
  | "inactiveProducts"
  | "invalidCostBody"
  | "invalidCostTitle"
  | "invalidInventoryBody"
  | "invalidInventoryTitle"
  | "invalidPriceBody"
  | "invalidPriceTitle"
  | "inventoryHint"
  | "inventoryOnHand"
  | "missingNameBody"
  | "missingNameTitle"
  | "newProduct"
  | "noActiveProducts"
  | "noInactiveProducts"
  | "onHand"
  | "pricePerUnit"
  | "productName"
  | "save"
  | "updateProduct"
  | "vendorCatalogSubtitle"
  | "vendorCatalogTitle"
  | "left"

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    analytics: "Analytics",
    analyticsTitle: "Analytics",
    appLanguage: "App language",
    avgSale: "Avg sale",
    bestMarginItem: "Best margin item",
    bulkRestock: "Bulk restock",
    businessHealth: "Business health",
    cancel: "Cancel",
    changeLanguageHelper:
      "Switch languages for labels across the app.",
    currency: "Currency",
    currencyHelper: "Choose how money is displayed.",
    daysTracked: "Days tracked",
    enterQuantity: "Enter quantity",
    enterValidQuantityTitle: "Enter a valid quantity",
    enterValidQuantityBody: "Quantity must be at least 1.",
    enterValidTotalTitle: "Enter a valid total cost",
    enterValidTotalBody: "Total cost must be 0 or more.",
    expenses: "Expenses",
    estimatedTotal: "Estimated total",
    explore: "Explore",
    exploreIntro:
      "This app includes example code to help you get started.",
    fileBasedRoutingBody:
      "This app has two screens: app/(tabs)/index.tsx and app/(tabs)/explore.tsx.",
    fileBasedRoutingBody2:
      "The layout file in app/(tabs)/_layout.tsx sets up the tab navigator.",
    fileBasedRoutingTitle: "File-based routing",
    imagesBody:
      "For static images, you can use the @2x and @3x suffixes to provide files for different screen densities.",
    imagesTitle: "Images",
    learnMore: "Learn more",
    lightDarkModeBody:
      "This template has light and dark mode support. The useColorScheme() hook lets you inspect what the user's current color scheme is, and so you can adjust UI colors accordingly.",
    lightDarkModeTitle: "Light and dark mode components",
    platformSupportBody:
      "You can open this project on Android, iOS, and the web. To open the web version, press w in the terminal running this project.",
    platformSupportTitle: "Android, iOS, and web support",
    animationsBody:
      "This template includes an example of an animated component. The components/HelloWave.tsx component uses the powerful react-native-reanimated library to create a waving hand animation.",
    animationsBody2:
      "The components/ParallaxScrollView.tsx component provides a parallax effect for the header image.",
    animationsIosBody:
      "The components/ParallaxScrollView.tsx component provides a parallax effect for the header image.",
    animationsTitle: "Animations",
    grossMargin: "Gross margin",
    grossProfit: "Gross profit",
    holdRestock: "Hold + to restock in bulk.",
    inventory: "Inventory",
    inventoryValue: "Inventory value",
    inventoryWatch: "Inventory watch",
    lifetimeRevenue: "Lifetime revenue",
    language: "Language",
    lowStock: "Low stock",
    mostRestockedItem: "Most restocked item",
    mostSoldItem: "Most sold item",
    apply: "Apply",
    periodMonth: "This Month",
    periodToday: "Today",
    periodWeek: "This Week",
    periodYear: "This Year",
    potentialRevenue: "Potential revenue",
    noRestocks: "No restocks yet",
    noSales: "No sales yet",
    quantity: "Quantity",
    restock: "Restock",
    restockSpend: "Restock spend",
    sales: "Sales",
    salesLogged: "total sales logged.",
    profit: "Profit",
    productInsights: "Product insights",
    qtyUnitCost: "qty × unit cost",
    revenue: "Revenue",
    restocked: "restocked",
    sold: "sold",
    salesOverview: "Sales overview",
    settings: "Settings",
    settingsTitle: "Settings",
    slowMover: "Slow mover",
    stockHealthy: "Stock levels look healthy.",
    topRevenueItem: "Top revenue item",
    totalCost: "Total cost",
    totalSales: "Total sales",
    undo: "Undo",
    vendors: "Vendors",
    vndRateHelper: "Set the exchange rate for USD → VND.",
    vndRateLabel: "USD → VND rate",
    currencyUSD: "US dollar (USD)",
    currencyVND: "Vietnamese dong (VND)",
    activeItems: "Active items",
    activate: "Activate",
    activeProducts: "Active products",
    addToCatalog: "Add to catalog",
    archive: "Archive",
    archiveProductBody:
      "This will hide {name} from your catalog without changing revenue or expenses.",
    archiveProductTitle: "Archive product?",
    catalogHelper:
      "Catalog items start with zero inventory and no expenses.",
    costPerUnit: "Cost per unit",
    deactivate: "Deactivate",
    edit: "Edit",
    inactiveProducts: "Inactive products",
    invalidCostBody: "Enter a valid cost.",
    invalidCostTitle: "Invalid cost",
    invalidInventoryBody: "Enter a valid inventory count.",
    invalidInventoryTitle: "Invalid inventory",
    invalidPriceBody: "Enter a valid price.",
    invalidPriceTitle: "Invalid price",
    inventoryHint:
      "Inventory changes do not affect revenue or expenses.",
    inventoryOnHand: "Inventory on hand",
    missingNameBody: "Enter a product name.",
    missingNameTitle: "Missing name",
    newProduct: "New product",
    noActiveProducts: "No active products.",
    noInactiveProducts: "No inactive products.",
    onHand: "on hand",
    pricePerUnit: "Price per unit",
    productName: "Product name",
    save: "Save",
    updateProduct: "Update",
    vendorCatalogSubtitle:
      "Add or remove products without affecting revenue or expenses.",
    vendorCatalogTitle: "Vendor Catalog",
    left: "left",
  },
  vi: {
    analytics: "Phân tích",
    analyticsTitle: "Phân tích",
    appLanguage: "Ngôn ngữ ứng dụng",
    avgSale: "Giá trị trung bình",
    bestMarginItem: "Biên lợi nhuận cao nhất",
    bulkRestock: "Nhập hàng số lượng lớn",
    businessHealth: "Sức khỏe kinh doanh",
    cancel: "Hủy",
    changeLanguageHelper:
      "Đổi ngôn ngữ cho các nhãn trên toàn ứng dụng.",
    currency: "Tiền tệ",
    currencyHelper: "Chọn cách hiển thị tiền.",
    daysTracked: "Số ngày theo dõi",
    enterQuantity: "Nhập số lượng",
    enterValidQuantityTitle: "Nhập số lượng hợp lệ",
    enterValidQuantityBody: "Số lượng phải ít nhất là 1.",
    enterValidTotalTitle: "Nhập tổng chi phí hợp lệ",
    enterValidTotalBody: "Tổng chi phí phải lớn hơn hoặc bằng 0.",
    expenses: "Chi phí",
    estimatedTotal: "Tổng ước tính",
    explore: "Khám phá",
    exploreIntro:
      "Ứng dụng này có các ví dụ để bạn bắt đầu nhanh hơn.",
    fileBasedRoutingBody:
      "Ứng dụng có hai màn hình: app/(tabs)/index.tsx và app/(tabs)/explore.tsx.",
    fileBasedRoutingBody2:
      "Tệp layout trong app/(tabs)/_layout.tsx thiết lập tab navigator.",
    fileBasedRoutingTitle: "Điều hướng theo tệp",
    imagesBody:
      "Với ảnh tĩnh, bạn có thể dùng hậu tố @2x và @3x để phù hợp mật độ màn hình khác nhau.",
    imagesTitle: "Hình ảnh",
    learnMore: "Tìm hiểu thêm",
    lightDarkModeBody:
      "Mẫu này hỗ trợ chế độ sáng và tối. Hook useColorScheme() giúp bạn kiểm tra giao diện hiện tại để điều chỉnh màu sắc phù hợp.",
    lightDarkModeTitle: "Thành phần sáng và tối",
    platformSupportBody:
      "Bạn có thể mở dự án này trên Android, iOS và web. Để mở bản web, nhấn w trong terminal đang chạy dự án.",
    platformSupportTitle: "Hỗ trợ Android, iOS và web",
    animationsBody:
      "Mẫu này có ví dụ về thành phần có hiệu ứng. Thành phần components/HelloWave.tsx dùng thư viện react-native-reanimated để tạo hiệu ứng vẫy tay.",
    animationsBody2:
      "Thành phần components/ParallaxScrollView.tsx tạo hiệu ứng parallax cho ảnh tiêu đề.",
    animationsIosBody:
      "Thành phần components/ParallaxScrollView.tsx tạo hiệu ứng parallax cho ảnh tiêu đề.",
    animationsTitle: "Hoạt ảnh",
    grossMargin: "Biên lợi nhuận gộp",
    grossProfit: "Lợi nhuận gộp",
    holdRestock: "Giữ + để nhập hàng số lượng lớn.",
    inventory: "Tồn kho",
    inventoryValue: "Giá trị tồn kho",
    inventoryWatch: "Theo dõi tồn kho",
    lifetimeRevenue: "Doanh thu tổng",
    language: "Ngôn ngữ",
    lowStock: "Sắp hết hàng",
    mostRestockedItem: "Mặt hàng nhập nhiều nhất",
    mostSoldItem: "Mặt hàng bán chạy nhất",
    apply: "Áp dụng",
    periodMonth: "Tháng này",
    periodToday: "Hôm nay",
    periodWeek: "Tuần này",
    periodYear: "Năm nay",
    potentialRevenue: "Doanh thu tiềm năng",
    noRestocks: "Chưa có nhập hàng",
    noSales: "Chưa có bán hàng",
    quantity: "Số lượng",
    restock: "Nhập hàng",
    restockSpend: "Chi phí nhập hàng",
    sales: "Bán hàng",
    salesLogged: "giao dịch bán hàng đã ghi.",
    profit: "Lợi nhuận",
    productInsights: "Thông tin sản phẩm",
    qtyUnitCost: "số lượng × giá vốn",
    revenue: "Doanh thu",
    restocked: "đã nhập",
    sold: "đã bán",
    salesOverview: "Tổng quan bán hàng",
    settings: "Cài đặt",
    settingsTitle: "Cài đặt",
    slowMover: "Bán chậm",
    stockHealthy: "Tồn kho đang ổn định.",
    topRevenueItem: "Sản phẩm doanh thu cao nhất",
    totalCost: "Tổng chi phí",
    totalSales: "Tổng số bán",
    undo: "Hoàn tác",
    vendors: "Nhà cung cấp",
    vndRateHelper: "Cập nhật tỷ giá USD → VND.",
    vndRateLabel: "Tỷ giá USD → VND",
    currencyUSD: "Đô la Mỹ (USD)",
    currencyVND: "Việt Nam đồng (VND)",
    activeItems: "Mặt hàng đang bán",
    activate: "Kích hoạt",
    activeProducts: "Sản phẩm đang hoạt động",
    addToCatalog: "Thêm vào danh mục",
    archive: "Lưu trữ",
    archiveProductBody:
      "Thao tác này sẽ ẩn {name} khỏi danh mục mà không thay đổi doanh thu hoặc chi phí.",
    archiveProductTitle: "Lưu trữ sản phẩm?",
    catalogHelper:
      "Danh mục bắt đầu với tồn kho bằng 0 và không có chi phí.",
    costPerUnit: "Giá vốn mỗi đơn vị",
    deactivate: "Tạm dừng",
    edit: "Chỉnh sửa",
    inactiveProducts: "Sản phẩm không hoạt động",
    invalidCostBody: "Nhập giá vốn hợp lệ.",
    invalidCostTitle: "Giá vốn không hợp lệ",
    invalidInventoryBody: "Nhập số lượng tồn kho hợp lệ.",
    invalidInventoryTitle: "Tồn kho không hợp lệ",
    invalidPriceBody: "Nhập giá hợp lệ.",
    invalidPriceTitle: "Giá không hợp lệ",
    inventoryHint:
      "Thay đổi tồn kho không ảnh hưởng đến doanh thu hoặc chi phí.",
    inventoryOnHand: "Tồn kho hiện tại",
    missingNameBody: "Nhập tên sản phẩm.",
    missingNameTitle: "Thiếu tên",
    newProduct: "Sản phẩm mới",
    noActiveProducts: "Không có sản phẩm hoạt động.",
    noInactiveProducts: "Không có sản phẩm không hoạt động.",
    onHand: "tồn kho",
    pricePerUnit: "Giá bán mỗi đơn vị",
    productName: "Tên sản phẩm",
    save: "Lưu",
    updateProduct: "Cập nhật",
    vendorCatalogSubtitle:
      "Thêm hoặc xóa sản phẩm mà không ảnh hưởng doanh thu hoặc chi phí.",
    vendorCatalogTitle: "Danh mục nhà cung cấp",
    left: "còn lại",
  },
}

export const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>(getLanguage())

  useEffect(() => {
    const unsubscribe = subscribeToLanguage(next => {
      setLanguageState(next)
    })
    return unsubscribe
  }, [])

  const t = useCallback(
    (key: TranslationKey) =>
      translations[language][key] ??
      translations.en[key] ??
      key,
    [language]
  )

  const updateLanguage = useCallback(
    (next: Language) => {
      setLanguage(next)
    },
    []
  )

  return useMemo(
    () => ({ language, setLanguage: updateLanguage, t }),
    [language, t, updateLanguage]
  )
}
