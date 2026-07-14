import Hero from "@/components/home/Hero";
import TrendingTopics from "@/components/home/TrendingTopics";
import FeaturedStories from "@/components/home/FeaturedStories";
import LuxuryFeed from "@/components/home/LuxuryFeed";
import EditorPicks from "@/components/home/EditorPicks";
import TrendingBrands from "@/components/home/TrendingBrands";
import VideoReels from "@/components/home/VideoReels";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />

      <TrendingTopics />

      <FeaturedStories />

      <LuxuryFeed />

      <EditorPicks />

      <TrendingBrands />

      <VideoReels />

      <Newsletter />
    </>
  );
}
