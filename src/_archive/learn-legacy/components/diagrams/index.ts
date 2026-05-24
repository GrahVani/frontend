import ZodiacWheel from "./ZodiacWheel";
import HouseChart from "./HouseChart";
import PlanetOrbit from "./PlanetOrbit";
import NakshatraWheel from "./NakshatraWheel";
import ConceptIllustration from "./ConceptIllustration";

export { ZodiacWheel, HouseChart, PlanetOrbit, NakshatraWheel, ConceptIllustration };

export const DIAGRAM_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "zodiac-wheel": ZodiacWheel,
  "house-chart": HouseChart,
  "planet-orbit": PlanetOrbit,
  "nakshatra-wheel": NakshatraWheel,
  "concept-illustration": ConceptIllustration,
};
