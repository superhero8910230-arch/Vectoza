mport { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function App() {
  const [image, setImage] = useState(null);
  const [svg, setSvg] = useState(null);
  const [colors, setColors] = useState(16);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const convertToVector = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const svgOutput = await invoke("convert_to_svg", { 
        imagePath: image, 
        colorCount: Number(colors) 
      });
      setSvg(svgOutput);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h2>PNG to Vector Converter</h2>
      
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      <div style={{ margin: "20px 0" }}>
        <label>Colors: {colors}</label>
        <input 
          type="range" min="2" max="64" 
          value={colors} 
          onChange={(e) => setColors(e.target.value)} 
        />
      </div>

      <button onClick={convertToVector} disabled={!image || loading}>
        {loading ? "Converting..." : "Convert to Vector"}
      </button>

      {svg && (
        <div style={{ marginTop: "20px" }}>
          <h3>Vector Preview:</h3>
          <div dangerouslySetInnerHTML={{ __html: svg }} style={{ maxWidth: "400px", margin: "0 auto" }} />
          <a href={data:image/svg+xml;utf8,${encodeURIComponent(svg)}} download="output.svg">
            <button style={{ marginTop: "10px" }}>Download SVG</button>
          </a>
        </div>
      )}
    </div>
  );
}
