import { getPlayerShopData } from "@/actions/shop";
import { Navbar } from "@/components/Navbar";
import { PackOpeningScreen } from "@/components/shop/PackOpeningScreen";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loja de Pacotes & Gacha - KazTactics",
  description:
    "Adquira novos pacotes de cartas táticas com ouro ganho em batalhas e expanda sua coleção com distribuição ponderada por raridade.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const shopData = await getPlayerShopData();

  const user = shopData?.user || {
    gold: 500,
    basicPacks: 0,
    advancedPacks: 0,
    supremePacks: 1,
    username: "EstrategistaKaz",
  };

  return (
    <div className="min-h-screen text-[#F8FAFC]">
      <Navbar gold={user.gold} username={user.username} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <PackOpeningScreen
          initialGold={user.gold}
          initialBasicPacks={user.basicPacks ?? 0}
          initialAdvancedPacks={user.advancedPacks ?? 0}
          initialSupremePacks={user.supremePacks ?? 1}
          username={user.username}
        />
      </main>
    </div>
  );
}

