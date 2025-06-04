import { type ReactNode } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  fullDescription: string;
  backgroundImage: string;
  children?: ReactNode; // Make children optional
}

const ProjectCard = ({
  title,
  description,
  fullDescription,
  backgroundImage,
}: //   children,
ProjectCardProps) => {
  return (
    // color: bg-gradient-to-b from-yellow-400 to-yellow-500
    <div className="group relative w-full max-w-sm h-[500px] rounded-3xl shadow-md overflow-hidden transition-all duration-500 ease-in-out hover:shadow-xl hover:shadow-black/20 cursor-pointer">
      {/* Placeholder Content */}
      <div className="w-full h-full transition-all duration-500 ease-in-out group-hover:scale-0 group-hover:rotate-45">
        <div
          className="h-1/2 bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="flex flex-col justify-between h-1/2 p-4">
          <h5 className="text-lg font-semibold mt-3">{title}</h5>
          <small className="text-sm text-gray-700 mt-4">{description}</small>
        </div>
      </div>

      {/* Hover Content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 w-full h-full p-5 box-border bg-white flex flex-col justify-center opacity-0 transition-all duration-500 ease-in-out group-hover:transform group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:rotate-0 group-hover:opacity-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {fullDescription}
        </p>
      </div>
    </div>
  );
};

const ProjectCards = () => {
  const cards = [
    {
      title: "Land Use Land Cover",
      description:
        "KSA, with Microsoft AI for Good and Clark University, is using AI to map 2022 land use in Murang'a County. Enhanced by drone imagery, this work provides insights into regional land patterns for better planning.",
      fullDescription:
        "Since November 2023, KSA has partnered with Microsoft AI for Good and Clark University's Geospatial Analytics Center to develop an AI model that classifies land use and land cover patterns across Murang'a County, providing crucial data for agricultural planning and resource management.",
      backgroundImage: "/data/LULC3.jpg",
    },
    {
      title: "Crop Type Mapping",
      description:
        "Advanced satellite imagery and machine learning algorithms are employed to identify and map different crop types across the region, enabling better agricultural planning and resource allocation.",
      fullDescription:
        "Our comprehensive crop type mapping initiative uses multi-spectral satellite data combined with ground truth validation to create detailed maps of crop distribution, helping farmers and policymakers make informed decisions about agricultural practices and market planning.",
      backgroundImage: "/data/pexels-tomfisk-1573884.jpg",
    },
    {
      title: "Yield Prediction",
      description:
        "Predictive analytics and remote sensing technologies are used to forecast crop yields, helping farmers and stakeholders prepare for harvest seasons and market fluctuations.",
      fullDescription:
        "Through the integration of weather data, soil conditions, and crop health indicators derived from satellite imagery, our yield prediction models provide accurate forecasts that support food security planning and agricultural investment decisions.",
      backgroundImage: "/data/Harvest2.jpg",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-12 mb-8">
      {cards.map((card, index) => (
        <ProjectCard
          key={index}
          title={card.title}
          description={card.description}
          fullDescription={card.fullDescription}
          backgroundImage={card.backgroundImage}
        />
      ))}
    </div>
  );
};

export default ProjectCards;
