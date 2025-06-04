const Timeline = () => {
  const timelineItems = [
    {
      position: "left",
      text: "Increase agricultural efficiency and productivity",
    },
    {
      position: "right",
      text: "Support data-driven policy development for better resource allocation",
    },
    {
      position: "left",
      text: "Reduce farm input costs and environmental impact",
    },
    {
      position: "right",
      text: "Strengthen food security through predictive analytics and early warning systems",
    },
  ];

  return (
    <div className="relative my-8 px-4">
      {/* Central line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-600"></div>

      {timelineItems.map((item, index) => (
        <div
          key={index}
          className={`relative w-1/2 p-5 box-border ${
            item.position === "left"
              ? "left-0 text-right pr-8"
              : "left-1/2 text-left pl-8"
          }`}
        >
          {/* Circle point */}
          <div
            className={`absolute w-4 h-4 bg-yellow-400 rounded-full top-8 transform ${
              item.position === "left"
                ? "right-0 translate-x-2"
                : "left-0 -translate-x-2"
            } z-20`}
          ></div>

          {/* Content */}
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-600">
            <p className="font-semibold text-gray-800">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
