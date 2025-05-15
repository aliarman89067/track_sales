import { Brush, ScrollText, Stars, Users } from "lucide-react";

export const HEADER_GRID = [
  {
    id: 0,
    text: "Customize your admin profile to suit your needs effortlessly",
    icon: Brush,
  },
  {
    id: 1,
    text: "Keep your workspace tidy by creating separate groups.",
    icon: Users,
  },
  {
    id: 2,
    text: "Add members, set targets, and track progress in a sleek interface.",
    icon: Stars,
  },
  {
    id: 3,
    text: "Customize your admin profile to suit your needs effortlessly",
    icon: ScrollText,
  },
];

export const NAVBAR_LINKS = [
  {
    id: 1,
    label: "Home",
    href: "/",
  },
  {
    id: 2,
    label: "Your Organizations",
    href: "/organizations",
  },
  {
    id: 3,
    label: "Dashboard",
    href: "/dashboard",
  },
];

export const FOOTER_FEATURES = [
  {
    id: 1,
    label: "Add Agent",
    href: "/agent",
  },
  {
    id: 2,
    label: "Create Organization",
    href: "/organizations/create",
  },
];
