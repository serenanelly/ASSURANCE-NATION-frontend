"use client";

/**
 * Icon adapter — maps the icon names used across the app to the Hugeicons
 * package (@hugeicons/react + @hugeicons/core-free-icons).
 *
 * Each export is a small component wrapping <HugeiconsIcon>, keeping the same
 * call-site API as before (`<Bell className="h-5 w-5" />`) so swapping the
 * import path from "@/components/icons" to "@/components/icons" is all that's needed.
 */

import { forwardRef } from "react";
import {
  HugeiconsIcon,
  type HugeiconsProps,
  type IconSvgElement,
} from "@hugeicons/react";
import {
  Alert02Icon,
  AlertCircleIcon,
  Analytics01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BellIcon,
  Briefcase01Icon,
  Calendar01Icon,
  Call02Icon,
  Cancel01Icon,
  CancelCircleIcon,
  ChartUpIcon,
  CheckmarkCircle01Icon,
  CheckmarkCircle02Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock01Icon,
  DashboardSquare01Icon,
  EyeIcon,
  EyeOffIcon,
  File01Icon,
  FileHeartIcon,
  GlobeIcon,
  HeartPulseIcon,
  HelpCircleIcon,
  Home01Icon,
  InformationCircleIcon,
  Invoice01Icon,
  Loading03Icon,
  LockIcon,
  Logout01Icon,
  Mail01Icon,
  MapPinIcon,
  Menu01Icon,
  MoonIcon,
  PencilIcon,
  PillIcon,
  PlusSignIcon,
  Search01Icon,
  Settings01Icon,
  Shield01Icon,
  StethoscopeIcon,
  Sun01Icon,
  UserCircleIcon,
  UserIcon,
  UserMultiple02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

export type IconProps = Omit<HugeiconsProps, "icon">;

/** Back-compat alias for the old lucide-react type import. */
export type LucideIcon = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>;

function createIcon(icon: IconSvgElement, displayName: string): LucideIcon {
  const Icon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
    <HugeiconsIcon ref={ref} icon={icon} {...props} />
  ));
  Icon.displayName = displayName;
  return Icon;
}

export const AlertTriangle = createIcon(Alert02Icon, "AlertTriangle");
export const AlertCircle = createIcon(AlertCircleIcon, "AlertCircle");
export const ArrowLeft = createIcon(ArrowLeft01Icon, "ArrowLeft");
export const ArrowRight = createIcon(ArrowRight01Icon, "ArrowRight");
export const BarChart3 = createIcon(Analytics01Icon, "BarChart3");
export const Bell = createIcon(BellIcon, "Bell");
export const Briefcase = createIcon(Briefcase01Icon, "Briefcase");
export const Calendar = createIcon(Calendar01Icon, "Calendar");
export const CheckCircle = createIcon(CheckmarkCircle01Icon, "CheckCircle");
export const CheckCircle2 = createIcon(CheckmarkCircle02Icon, "CheckCircle2");
export const ChevronDown = createIcon(ChevronDownIcon, "ChevronDown");
export const ChevronLeft = createIcon(ChevronLeftIcon, "ChevronLeft");
export const ChevronRight = createIcon(ChevronRightIcon, "ChevronRight");
export const Clock = createIcon(Clock01Icon, "Clock");
export const Eye = createIcon(EyeIcon, "Eye");
export const EyeOff = createIcon(EyeOffIcon, "EyeOff");
export const FileHeart = createIcon(FileHeartIcon, "FileHeart");
export const FileQuestion = createIcon(HelpCircleIcon, "FileQuestion");
export const FileText = createIcon(File01Icon, "FileText");
export const Globe = createIcon(GlobeIcon, "Globe");
export const HeartPulse = createIcon(HeartPulseIcon, "HeartPulse");
export const Home = createIcon(Home01Icon, "Home");
export const Info = createIcon(InformationCircleIcon, "Info");
export const LayoutDashboard = createIcon(DashboardSquare01Icon, "LayoutDashboard");
export const Loader2 = createIcon(Loading03Icon, "Loader2");
export const Lock = createIcon(LockIcon, "Lock");
export const LogOut = createIcon(Logout01Icon, "LogOut");
export const Mail = createIcon(Mail01Icon, "Mail");
export const MapPin = createIcon(MapPinIcon, "MapPin");
export const Menu = createIcon(Menu01Icon, "Menu");
export const Moon = createIcon(MoonIcon, "Moon");
export const Pencil = createIcon(PencilIcon, "Pencil");
export const Phone = createIcon(Call02Icon, "Phone");
export const Pill = createIcon(PillIcon, "Pill");
export const Plus = createIcon(PlusSignIcon, "Plus");
export const Receipt = createIcon(Invoice01Icon, "Receipt");
export const Search = createIcon(Search01Icon, "Search");
export const Settings = createIcon(Settings01Icon, "Settings");
export const Shield = createIcon(Shield01Icon, "Shield");
export const Stethoscope = createIcon(StethoscopeIcon, "Stethoscope");
export const Sun = createIcon(Sun01Icon, "Sun");
export const TrendingUp = createIcon(ChartUpIcon, "TrendingUp");
export const User = createIcon(UserIcon, "User");
export const UserCircle = createIcon(UserCircleIcon, "UserCircle");
export const UserRound = createIcon(UserCircleIcon, "UserRound");
export const Users = createIcon(UserMultiple02Icon, "Users");
export const Wallet = createIcon(Wallet01Icon, "Wallet");
export const X = createIcon(Cancel01Icon, "X");
export const XCircle = createIcon(CancelCircleIcon, "XCircle");
