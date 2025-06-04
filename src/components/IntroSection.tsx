const IntroSection = () => {
  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[50vh] gap-4">
      <div className="w-full md:w-1/2 pr-0 md:pr-6">
        <h4 className="text-xl font-semibold mb-4">Introduction</h4>
        <p className="text-gray-600 leading-relaxed">
          In recent years, the utilization of Earth Observation (EO) related
          technologies has revolutionized agricultural management by providing
          near real-time and high-resolution satellite data that aid in mapping
          of agricultural activities, monitor crop health, soil conditions, and
          weather patterns. This technological advancement has enabled farmers
          and agricultural stakeholders to make informed decisions, optimize
          resource allocation, and improve overall productivity while promoting
          sustainable farming practices.
        </p>
      </div>
      <div
        className="w-full md:w-1/2 h-64 md:h-full rounded-lg bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/data/pexels-donnyyularso-20650097.jpg')",
        }}
      ></div>
    </div>
  );
};

export default IntroSection;
