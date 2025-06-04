const QuoteSection = () => {
  return (
    <div className="my-8">
      <div className="max-w-2xl mx-auto p-5 text-lg text-gray-800 bg-gray-50 border-l-4 border-gray-800 rounded-lg relative">
        {/* Quote icon */}
        <div className="text-3xl text-gray-800 mb-2">"</div>
        <p className="italic">
          Murang'a's unique blend of climate zones and topographies makes it
          representative of many agricultural regions across Kenya, making this
          pilot project's findings scalable and applicable to broader
          agricultural development initiatives nationwide.
        </p>
        <div className="text-3xl text-gray-800 float-right transform scale-x-[-1]">
          "
        </div>
      </div>
    </div>
  );
};

export default QuoteSection;
