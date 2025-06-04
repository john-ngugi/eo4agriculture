const Partners = () => {
  // Sample partner logos - replace with actual logo paths
  const normalLogos = [
    { src: "/data/murangacounty.png", alt: "murangacounty" },
    { src: "/data/ksa_logo.png", alt: "ksa_logo" },
    { src: "/data/MoA.jpg", alt: "MoA" },
    { src: "/data/DRSRS.jpg", alt: "DRSRS" },
    { src: "/data/KARLO.jpg", alt: "KARLO" },
    { src: "/data/DeKUT.jpg", alt: "DeKUT" },
    { src: "/data/TTU.jpg", alt: "TTU" },
    { src: "/data/JKUAT.jpg", alt: "JKUAT" },
    { src: "/data/CIAT.jpg", alt: "CIAT" },
    { src: "/data/CETRAD.jpg", alt: "CETRAD" },
  ];

  const largeLogos = [
    {
      src: "/data/Microsoft-AI4G-Lab-Logo.png",
      alt: "Microsoft",
      id: "ms-logo",
    },
    // { src: "/static/images/clark-university.png", alt: "Clark University" },
  ];

  return (
    <div className="py-12 bg-gray-50">
      <h4 className="text-2xl font-semibold text-center mb-8">Our Partners</h4>

      {/* Normal Partners Grid */}
      <div className="flex justify-center items-center px-5">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 max-w-full overflow-x-auto md:overflow-visible">
          {normalLogos.map((logo, index) => (
            <div key={index} className="flex justify-center items-center">
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full h-auto max-w-20 object-contain p-1 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Large Partner Logos */}
      <div className="flex justify-center items-start gap-5 mt-8 ml-5">
        {largeLogos.map((logo, index) => (
          <div key={index} className="flex justify-center items-center">
            <img
              src={logo.src}
              alt={logo.alt}
              className={`w-auto h-8 object-contain transition-all duration-300 hover:scale-110 ${
                logo.id === "ms-logo" ? "bg-gray-800 p-2 rounded" : ""
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
