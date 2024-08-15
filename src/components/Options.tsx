const Options = ({ data, setPosition }) => {
  return (
    <div className="text-white absolute  w-full">
      {data &&
        data.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer bg-white text-black border-2 hover:bg-blue-gray-50"
            onClick={() => setPosition(item)}
          >
            {item.formatted_address}
          </div>
        ))}
    </div>
  );
};

export default Options;
