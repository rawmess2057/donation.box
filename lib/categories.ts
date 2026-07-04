import {
  HeartPulse, Church, AlertTriangle, HandHeart, Book, PawPrint,
  TreePine, Building2, Users, Trophy, Palette, CalendarDays,
  Cross, Heart, Medal, Plane, Hand, Star, Ambulance, ShieldCheck,
  TrendingUp, Zap,
  type LucideIcon,
} from "lucide-react";

export const CATEGORIES = [
  "Medical", "Memorial", "Emergency", "Nonprofit", "Education",
  "Animal", "Environment", "Business", "Community", "Competition",
  "Creative", "Event", "Faith", "Family", "Sports", "Travel",
  "Volunteer", "Wishes", "Crisis Relief", "Donate to Verified Relief",
  "Social Impact Funds", "Direct Support for Urgent Needs",
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_COLORS: Record<string, string> = {
  Medical: "bg-rose-950/30 text-rose-300 border border-rose-800/50",
  Memorial: "bg-slate-950/30 text-slate-300 border border-slate-800/50",
  Emergency: "bg-red-950/30 text-red-300 border border-red-800/50",
  Nonprofit: "bg-emerald-950/30 text-emerald-300 border border-emerald-800/50",
  Education: "bg-amber-950/30 text-amber-300 border border-amber-800/50",
  Animal: "bg-orange-950/30 text-orange-300 border border-orange-800/50",
  Environment: "bg-teal-950/30 text-teal-300 border border-teal-800/50",
  Business: "bg-blue-950/30 text-blue-300 border border-blue-800/50",
  Community: "bg-violet-950/30 text-violet-300 border border-violet-800/50",
  Competition: "bg-yellow-950/30 text-yellow-300 border border-yellow-800/50",
  Creative: "bg-pink-950/30 text-pink-300 border border-pink-800/50",
  Event: "bg-cyan-950/30 text-cyan-300 border border-cyan-800/50",
  Faith: "bg-purple-950/30 text-purple-300 border border-purple-800/50",
  Family: "bg-lime-950/30 text-lime-300 border border-lime-800/50",
  Sports: "bg-indigo-950/30 text-indigo-300 border border-indigo-800/50",
  Travel: "bg-sky-950/30 text-sky-300 border border-sky-800/50",
  Volunteer: "bg-green-950/30 text-green-300 border border-green-800/50",
  Wishes: "bg-fuchsia-950/30 text-fuchsia-300 border border-fuchsia-800/50",
  "Crisis Relief": "bg-rose-950/40 text-rose-200 border border-rose-700/50",
  "Donate to Verified Relief": "bg-emerald-950/40 text-emerald-200 border border-emerald-700/50",
  "Social Impact Funds": "bg-blue-950/40 text-blue-200 border border-blue-700/50",
  "Direct Support for Urgent Needs": "bg-amber-950/40 text-amber-200 border border-amber-700/50",
};

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Medical: HeartPulse,
  Memorial: Church,
  Emergency: AlertTriangle,
  Nonprofit: HandHeart,
  Education: Book,
  Animal: PawPrint,
  Environment: TreePine,
  Business: Building2,
  Community: Users,
  Competition: Trophy,
  Creative: Palette,
  Event: CalendarDays,
  Faith: Cross,
  Family: Heart,
  Sports: Medal,
  Travel: Plane,
  Volunteer: Hand,
  Wishes: Star,
  "Crisis Relief": Ambulance,
  "Donate to Verified Relief": ShieldCheck,
  "Social Impact Funds": TrendingUp,
  "Direct Support for Urgent Needs": Zap,
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "bg-white/[0.08] text-fg-muted border border-white/10";
}
