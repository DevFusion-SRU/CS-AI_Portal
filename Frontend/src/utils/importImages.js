const images = import.meta.glob("../assets/*.{png,jpg,jpeg,svg}", { eager: true });

const imageMap = Object.keys(images).reduce((acc, path) => {
  const filename = path.split("/").pop();
  acc[filename] = images[path].default;
  return acc;
}, {});

export default imageMap;
