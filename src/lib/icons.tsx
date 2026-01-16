// MUI Icons mapping for consistent icon usage across the app
import {
  MenuBook as IconBook,
  BarChart as IconChart,
  TrendingUp as IconMoney,
  Delete as IconDelete,
  Add as IconAdd,
  ArrowBack as IconBack,
  Collections as IconNotes,
  FolderOff as IconEmpty,
  Security as IconSecurity,
  School as IconEducation,
  Phone as IconMobile,
  AttachMoney as IconPrice,
  Star as IconStar,
  CloudUpload as IconUpload,
  HourglassEmpty as IconLoading,
  CheckCircle as IconComplete,
  Home as IconHome,
  Settings as IconSettings,
  Logout as IconLogout,
  AccountCircle as IconAccount,
  Lock as IconLock,
  Email as IconEmail,
  Search as IconSearch,
  Payment as IconPayment,
  Download as IconDownload,
  BusinessOutlined as IconUniversity,
  LibraryBooks as IconCourse,
  SchoolOutlined as IconBranch,
  CalendarToday as IconCalendar,
  SentimentSatisfied as IconHappy,
  SentimentDissatisfied as IconSad,
  ShoppingCart as IconCart,
} from '@mui/icons-material';

export const ICONS = {
  // Navigation & Common
  book: IconBook,
  dashboard: IconChart,
  notes: IconNotes,
  back: IconBack,
  home: IconHome,
  settings: IconSettings,
  logout: IconLogout,
  account: IconAccount,
  
  // Actions
  add: IconAdd,
  delete: IconDelete,
  upload: IconUpload,
  search: IconSearch,
  payment: IconPayment,
  download: IconDownload,
  cart: IconCart,
  
  // Status
  money: IconMoney,
  complete: IconComplete,
  loading: IconLoading,
  empty: IconEmpty,
  happy: IconHappy,
  sad: IconSad,
  
  // Features
  security: IconSecurity,
  education: IconEducation,
  mobile: IconMobile,
  price: IconPrice,
  star: IconStar,
  
  // Details (Notes Page)
  university: IconUniversity,
  course: IconCourse,
  branch: IconBranch,
  calendar: IconCalendar,
  
  // Forms
  lock: IconLock,
  email: IconEmail,
};

export type IconKey = keyof typeof ICONS;

// Helper component for using icons
export function MuiIcon({ icon, ...props }: { icon: IconKey; [key: string]: any }) {
  const Icon = ICONS[icon];
  return <Icon {...props} />;
}
