import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: "Flocon - Boutique de fleurs et gâteaux personnalisés",
  description: "Découvrez nos magnifiques créations florales et pâtissières pour toutes vos occasions spéciales",
};

export default function HomePage() {
  return <HomePageClient />;
}
