import { GoVersions } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import "../Style/Version.css";

export default function Version({ size, storage, versions = [], onclose }) {
    const reversedVersions = [...versions].reverse();
  return (
    <div className="version-container">
      
      <div className="version-header">
        <h1 className="version-title">
          <GoVersions style={{color:"#2C66DD"}} size={30}/> File Versions
        </h1>

        <button className="close-btn" onClick={onclose}>
          <IoClose />
        </button>
      </div>

      <div className="version-summary">
        <div>
          <span>Size:</span> {size}
        </div>
        <div>
          <span>Storage Used:</span> {storage}
        </div>
      </div>

      <table className="version-table">
        <thead>
          <tr>
            <th>Version</th>
            <th>Date</th>
            <th>Size</th>
          </tr>
        </thead>

        <tbody>
          {reversedVersions.map((version, index) => (
            <tr key={index}>
              <td>#{version.version}</td>
              <td>{version.time}</td>
              <td>{size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
